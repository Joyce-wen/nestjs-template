import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from './user.schema';

export * from './tenant.schema';
export * from './user.schema';

export const Schemas = { users };
export type DB = NodePgDatabase<typeof Schemas>;
