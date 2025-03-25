import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  findAllTenants() {
    return this.tenantService.findAllTenants();
  }

  @Post('register')
  async registerTenant(@Body() { tenant_name, name, email, password }: { tenant_name: string; name: string; email: string; password: string }) {
    return await this.tenantService.registerTenant({ tenant_name, name, email, password });
  }
}
