import { execSync } from 'node:child_process';
import { config } from 'dotenv';
import { Client } from 'pg';

// Runs once before the suite: makes sure the Postgres test database exists and
// is migrated. Mongo creates its database lazily on first write.
export default async function globalSetup(): Promise<void> {
  config({ path: '.env.test', override: true, quiet: true });

  const testUrl = new URL(process.env.POSTGRES_URL!);
  const dbName = testUrl.pathname.slice(1);
  const adminUrl = new URL(testUrl);
  adminUrl.pathname = '/postgres';
  adminUrl.search = '';

  const admin = new Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  const { rowCount } = await admin.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName],
  );
  if (!rowCount) await admin.query(`CREATE DATABASE "${dbName}"`);
  await admin.end();

  execSync('npx prisma migrate deploy', { stdio: 'ignore', env: process.env });
}
