import { HttpStatus } from '@nestjs/common';
import { ExceptionMappingRegistry } from '@shared/infrastructure/http';
import {
  InsufficientTicketsException,
  ReservationAlreadyConfirmedException,
  ReservationCancelledException,
  ReservationExpiredException,
} from '@modules/reservation/domain';
import { reservationExceptionMappings } from './reservation.exception-mappings';

describe('reservationExceptionMappings', () => {
  const registry = new ExceptionMappingRegistry();
  registry.register(reservationExceptionMappings);

  it.each([
    [new ReservationExpiredException(), HttpStatus.GONE],
    [new ReservationAlreadyConfirmedException(), HttpStatus.CONFLICT],
    [new ReservationCancelledException(), HttpStatus.CONFLICT],
    [new InsufficientTicketsException(5, 2), HttpStatus.CONFLICT],
  ])('maps %p to %p', (error, status) => {
    expect(registry.resolve(error)?.status).toBe(status);
  });

  it('includes requested and available when tickets run out', () => {
    const error = new InsufficientTicketsException(5, 2);

    expect(registry.resolve(error)?.details?.(error)).toEqual({
      requested: 5,
      available: 2,
    });
  });
});
