import { DomainRuleException } from '@shared/domain';
import {
  InsufficientTicketsException,
  ReservationAlreadyConfirmedException,
  ReservationCancelledException,
  ReservationExpiredException,
} from './reservation.exceptions';

describe('Reservation exceptions', () => {
  it.each([
    [
      new ReservationExpiredException(),
      'ReservationExpiredException',
      'Reservation has expired',
    ],
    [
      new ReservationAlreadyConfirmedException(),
      'ReservationAlreadyConfirmedException',
      'Reservation is already confirmed',
    ],
    [
      new ReservationCancelledException(),
      'ReservationCancelledException',
      'Reservation is cancelled',
    ],
  ])('%p is a domain rule violation', (error, name, message) => {
    expect(error).toBeInstanceOf(DomainRuleException);
    expect(error).toMatchObject({ name, message });
  });

  it('InsufficientTicketsException reports requested and available', () => {
    const error = new InsufficientTicketsException(5, 2);

    expect(error).toBeInstanceOf(DomainRuleException);
    expect(error).toMatchObject({
      requested: 5,
      available: 2,
      message: 'Not enough tickets available: requested 5, available 2',
    });
  });
});
