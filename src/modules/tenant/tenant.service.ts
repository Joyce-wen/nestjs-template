import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tenants, TenantSchema } from '../../drizzle/schemas/tenant.schema';
import { UserService } from './../user/user.service';

@Injectable()
export class TenantService {
  constructor(
    @Inject('DEFAULT_DB') private readonly db: NodePgDatabase<typeof TenantSchema>,
    private readonly userService: UserService,
  ) {}

  async validateTenantId(id: number) {
    const tenant = await this.db.select().from(tenants).where(eq(tenants.id, id)).limit(1);

    if (tenant.length === 0) {
      throw new BadRequestException('Invalid tenant id');
    }
  }

  async findAllTenants() {
    return await this.db.select().from(tenants);
  }

  async createTenant(name: string) {
    return await this.db.insert(tenants).values({ name }).returning();
  }

  async registerTenant({ tenant_name, name, email, password }: { tenant_name: string; name: string; email: string; password: string }) {
    await this.db.insert(tenants).values({ name: tenant_name }).returning();
    return await this.userService.createUser(name, email, password);
  }
}
