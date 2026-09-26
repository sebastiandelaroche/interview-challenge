import { Module } from '@nestjs/common';
import { EventRepository } from './domain';
import { PostgresEventImplRepo } from './infrastructure/repo/postgres-event-impl.repo';
import { EventController } from './presentation/http/event.controller';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [{ provide: EventRepository, useClass: PostgresEventImplRepo }],
  exports: [EventRepository],
})
export class EventModule {}
