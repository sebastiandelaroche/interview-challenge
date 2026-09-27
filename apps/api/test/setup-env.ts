import { config } from 'dotenv';

// Point the app at the test databases before AppModule reads the environment.
config({ path: '.env.test', override: true, quiet: true });
