import { InsufficientTicketsException } from './reservation.exceptions';
import { TicketsQuantity } from './values';

export class ReservationService {
  static checkTicketAvailability(
    capacity: number,
    taken: number,
    requested: TicketsQuantity,
  ): void {
    const available = Math.max(capacity - taken, 0);
    if (requested > available)
      throw new InsufficientTicketsException(requested, available);
  }
}
