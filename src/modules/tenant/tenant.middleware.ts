import { Injectable, NestMiddleware } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}

  async use(req: any, res: any, next: () => void) {
    const tenantId = Number(req.headers['x-tenant-id']);
    await this.tenantService.validateTenantId(tenantId);
    next();
  }
}
