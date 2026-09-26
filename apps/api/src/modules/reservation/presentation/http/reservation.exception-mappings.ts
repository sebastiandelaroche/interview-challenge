import { HttpStatus } from '@nestjs/common';
import { ExceptionMapping, mapException } from '@shared/infrastructure/http';
import {
  InsufficientTicketsException,
  ReservationAlreadyConfirmedException,
  ReservationCancelledException,
  ReservationExpiredException,
} from '@modules/reservation/domain';

export const reservationExceptionMappings: ExceptionMapping[] = [
  mapException({
    exception: ReservationExpiredException,
    status: HttpStatus.GONE,
  }),
  mapException({
    exception: ReservationAlreadyConfirmedException,
    status: HttpStatus.CONFLICT,
  }),
  mapException({
    exception: ReservationCancelledException,
    status: HttpStatus.CONFLICT,
  }),
  mapException({
    exception: InsufficientTicketsException,
    status: HttpStatus.CONFLICT,
    details: (e) => ({ requested: e.requested, available: e.available }),
  }),
];
