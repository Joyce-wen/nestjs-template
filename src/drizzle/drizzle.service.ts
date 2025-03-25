import { execSync } from 'node:child_process';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DB, Schemas } from './schemas';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private defaultUrl = new ConfigService().getOrThrow<string>('DATABASE_URL');
  private readonly tenantConnections: Map<string, { pool: Pool; database: DB }> = new Map();
  private readonly logger = new Logger(DrizzleService.name);
  constructor(@Inject('DRIZZLE_POOL') private readonly defaultPool: Pool) {}

  onModuleDestroy() {
    for (const connection of this.tenantConnections.values()) {
      connection.pool.end().catch(() => {});
    }
  }

  async createTenantConnection(tenantId: number) {
    const path = `tenant_${tenantId}`;
    const database_url = this.defaultUrl += `/${path}`;

    if (this.tenantConnections.has(path)) {
      return this.tenantConnections.get(path)?.database;
    }

    await this.createDatabaseIfNotExists(path);
    const pool = new Pool({ connectionString: database_url });
    const database = drizzle(pool, { schema: Schemas }) as DB;
    this.tenantConnections.set(path, { pool, database });
    this.runMigrations(tenantId, database_url);
    return database;
  }

  private async createDatabaseIfNotExists(path: string) {
    const result = await this.defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [path]
    );

    if (result.rowCount === 0) {
      await this.defaultPool.query(`CREATE DATABASE ${path}`);
    }
  }

  private runMigrations(tenantId: number, connectionString: string) {
    const databaseUrl = this.defaultUrl;
    process.env.DATABASE_URL = connectionString;
    const output = execSync('drizzle-kit migrate --config drizzle.config.ts', {
      encoding: 'utf-8',
    });
    this.logger.log(`Migrations ran for tenant_${tenantId}: ${output}`);
    process.env.DATABASE_URL = databaseUrl;
  }
}
