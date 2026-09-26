import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  postgres: {
    url: process.env.POSTGRES_URL,
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
}));
