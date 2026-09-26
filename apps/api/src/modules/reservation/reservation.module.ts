import { Module } from '@nestjs/common';
import { EventModule } from '@modules/event/event.module';
import { ReservationRepository } from './domain';
import { PostgresReservationImplRepo } from './infrastructure/repo/postgres-reservation-impl.repo';
import {
  CancelReservationUseCase,
  ConfirmReservationUseCase,
  CreateReservationUseCase,
} from './application/use-cases';

@Module({
  imports: [EventModule],
  controllers: [],
  providers: [
    { provide: ReservationRepository, useClass: PostgresReservationImplRepo },
    CreateReservationUseCase,
    ConfirmReservationUseCase,
    CancelReservationUseCase,
  ],
  exports: [],
})
export class ReservationModule {}
