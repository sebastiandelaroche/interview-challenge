import { Module } from '@nestjs/common';
import { EventModule } from '@modules/event/event.module';
import { ReservationRepository } from './domain';
import { PostgresReservationImplRepo } from './infrastructure/repo/postgres-reservation-impl.repo';
import { ReservationController } from './presentation/http/reservation.controller';
import { reservationExceptionMappings } from './presentation/http/reservation.exception-mappings';
import { ExceptionMappingRegistry } from '@shared/infrastructure/http';
import {
  CancelReservationUseCase,
  ConfirmReservationUseCase,
  CreateReservationUseCase,
} from './application/use-cases';

@Module({
  imports: [EventModule],
  controllers: [ReservationController],
  providers: [
    { provide: ReservationRepository, useClass: PostgresReservationImplRepo },
    CreateReservationUseCase,
    ConfirmReservationUseCase,
    CancelReservationUseCase,
  ],
  exports: [],
})
export class ReservationModule {
  constructor(registry: ExceptionMappingRegistry) {
    registry.register(reservationExceptionMappings);
  }
}
