import { Module } from '@nestjs/common';
import { EventModule } from '@modules/event/event.module';
import { OrderRepository, ReservationRepository } from './domain';
import { MongoOrderImplRepo } from './infrastructure/repo/mongo-order-impl.repo';
import { PostgresReservationImplRepo } from './infrastructure/repo/postgres-reservation-impl.repo';
import { ReservationController } from './presentation/http/reservation.controller';
import { reservationExceptionMappings } from './presentation/http/reservation.exception-mappings';
import { ExceptionMappingRegistry } from '@shared/infrastructure/http';
import {
  CancelReservationUseCase,
  ConfirmReservationUseCase,
  CreateReservationUseCase,
  ExpireReservationsUseCase,
} from './application/use-cases';
import { GetReservationQuery } from './application/queries';
import { ReservationReadModel } from './application/read-models';
import { PostgresReservationReadModel } from './infrastructure/read/postgres-reservation-read-model';
import { ExpireReservationsCron } from './presentation/schedule/expire-reservations.cron';

@Module({
  imports: [EventModule],
  controllers: [ReservationController],
  providers: [
    { provide: ReservationRepository, useClass: PostgresReservationImplRepo },
    { provide: OrderRepository, useClass: MongoOrderImplRepo },
    { provide: ReservationReadModel, useClass: PostgresReservationReadModel },
    CreateReservationUseCase,
    ConfirmReservationUseCase,
    CancelReservationUseCase,
    ExpireReservationsUseCase,
    GetReservationQuery,
    ExpireReservationsCron,
  ],
  exports: [],
})
export class ReservationModule {
  constructor(registry: ExceptionMappingRegistry) {
    registry.register(reservationExceptionMappings);
  }
}
