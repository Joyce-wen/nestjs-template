import { DB, users } from '@/drizzle';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@Inject('TENANT_DB') private readonly db: DB) {}

  async findAllUsers() {
    return await this.db.select().from(users);
  }

  async createUser(name: string, email: string, password: string) {
    return await this.db.insert(users).values({ name, email, password }).returning();
  }
}
