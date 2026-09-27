import { INestApplication } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Clock } from '@shared/application';
import { MongoService, PostgresService } from '@shared/infrastructure/database';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { FakeClock } from './fake-clock';

export type TestApp = Awaited<ReturnType<typeof createTestApp>>;

// Boots the real AppModule (real Postgres + Mongo) with only the clock replaced.
export const createTestApp = async () => {
  const clock = new FakeClock();
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(Clock)
    .useValue(clock)
    .compile();

  const app: INestApplication = configureApp(moduleRef.createNestApplication());
  await app.init();

  // Time is driven by the tests, so the background expiry job stays off.
  await app.get(SchedulerRegistry).getCronJob('expire-reservations').stop();

  return {
    app,
    clock,
    http: () => request(app.getHttpServer()),
    postgres: app.get(PostgresService),
    mongo: app.get(MongoService),
  };
};
