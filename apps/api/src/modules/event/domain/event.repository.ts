import { Event } from './event';
import { EventId } from './values';

export abstract class EventRepository {
  abstract findById(id: EventId): Promise<Event | null>;
}
