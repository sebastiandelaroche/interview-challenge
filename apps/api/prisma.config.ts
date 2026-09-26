import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/shared/infrastructure/database/prisma/schema.prisma',
  migrations: {
    seed: 'tsx src/shared/infrastructure/database/prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
