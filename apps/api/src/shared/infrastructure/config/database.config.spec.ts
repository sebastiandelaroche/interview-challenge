import { databaseConfig } from './database.config';

describe('databaseConfig', () => {
  it('reads the connection strings from the environment', () => {
    process.env.POSTGRES_URL = 'postgresql://pg';
    process.env.MONGO_URL = 'mongodb://mongo';

    expect(databaseConfig()).toEqual({
      postgres: { url: 'postgresql://pg' },
      mongo: { url: 'mongodb://mongo' },
    });
  });
});
