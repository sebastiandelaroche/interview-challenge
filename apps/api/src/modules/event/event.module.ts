import { Module } from '@nestjs/common';
import { EventRepository } from './domain';
import { PostgresEventImplRepo } from './infrastructure/repo/postgres-event-impl.repo';

@Module({
  imports: [],
  controllers: [],
  providers: [{ provide: EventRepository, useClass: PostgresEventImplRepo }],
  exports: [EventRepository],
})
export class EventModule {}
