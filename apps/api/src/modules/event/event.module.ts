import { Module } from '@nestjs/common';
import { EventRepository } from './domain';
import { GetEventQuery, ListEventsQuery } from './application/queries';
import { EventReadModel } from './application/read-models';
import { PostgresEventReadModel } from './infrastructure/read/postgres-event-read-model';
import { PostgresEventImplRepo } from './infrastructure/repo/postgres-event-impl.repo';
import { EventController } from './presentation/http/event.controller';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [
    { provide: EventRepository, useClass: PostgresEventImplRepo },
    { provide: EventReadModel, useClass: PostgresEventReadModel },
    ListEventsQuery,
    GetEventQuery,
  ],
  exports: [EventRepository],
})
export class EventModule {}
