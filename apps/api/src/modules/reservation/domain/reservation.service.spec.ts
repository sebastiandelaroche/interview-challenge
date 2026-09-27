import { ReservationService } from './reservation.service';
import { InsufficientTicketsException } from './reservation.exceptions';
import { TicketsQuantity } from './values';

const qty = (n: number) => TicketsQuantity.create(n);

describe('ReservationService.checkTicketAvailability', () => {
  it('allows a request below what is available', () => {
    expect(() =>
      ReservationService.checkTicketAvailability(10, 3, qty(2)),
    ).not.toThrow();
  });

  it('allows a request that takes exactly the remaining tickets', () => {
    expect(() =>
      ReservationService.checkTicketAvailability(10, 3, qty(7)),
    ).not.toThrow();
  });

  it('rejects a request one ticket over what is available', () => {
    expect(() =>
      ReservationService.checkTicketAvailability(10, 3, qty(8)),
    ).toThrow(
      expect.objectContaining({
        name: 'InsufficientTicketsException',
        requested: 8,
        available: 7,
      }),
    );
  });

  it('treats an oversold tier as zero available', () => {
    expect(() =>
      ReservationService.checkTicketAvailability(10, 12, qty(1)),
    ).toThrow(new InsufficientTicketsException(1, 0));
  });
});
