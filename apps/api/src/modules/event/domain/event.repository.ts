import { Event } from './event';
import { EventId, TicketTierId } from './values';

export abstract class EventRepository {
  abstract findById(id: EventId): Promise<Event | null>;
  // Throws if no event owns the tier.
  abstract getByTicketTierId(ticketTierId: TicketTierId): Promise<Event>;
}
