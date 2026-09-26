import { DomainRuleException } from '@shared/domain';
import { TicketsQuantity } from './values';

export class ReservationService {
  static checkTicketAvailability(
    capacity: number,
    taken: number,
    requested: TicketsQuantity,
  ): void {
    const available = Math.max(capacity - taken, 0);
    if (requested > available)
      throw new DomainRuleException(
        `Not enough tickets available: requested ${requested}, available ${available}`,
      );
  }
}
