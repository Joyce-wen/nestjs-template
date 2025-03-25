import { DynamicModule, Module, Provider, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Request } from 'express';
import { Pool } from 'pg';
import { TenantModule } from '../modules/tenant/tenant.module';
import { DrizzleService } from './drizzle.service';
import { TenantSchema } from './schemas';

function PoolProvider(): Provider {
  return {
    provide: 'DRIZZLE_POOL',
    useFactory: (configService: ConfigService) => new Pool({
      connectionString: configService.getOrThrow<string>('DATABASE_URL'),
    }),
    inject: [ConfigService],
  };
}

function DefaultDBProvider(): Provider {
  return {
    provide: 'DEFAULT_DB',
    useFactory: (pool: Pool) => drizzle(pool, { schema: TenantSchema }) as NodePgDatabase<typeof TenantSchema>,
    inject: ['DRIZZLE_POOL'],
  };
}

function TenantDBProvider(): Provider {
  return {
    provide: 'TENANT_DB',
    scope: Scope.REQUEST,
    useFactory: async (drizzleService: DrizzleService, request: Request) => {
      const tenantId = Number(request.headers['x-tenant-id']);

      return await drizzleService.createTenantConnection(tenantId);
    },
    inject: [DrizzleService, REQUEST],
  };
}

@Module({
  imports: [TenantModule],
  providers: [DrizzleService],
})
export class DrizzleModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [PoolProvider(), DefaultDBProvider(), TenantDBProvider()];
    return { module: DrizzleModule, providers, exports: providers, global: true };
  }
}
