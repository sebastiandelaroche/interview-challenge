import { Event } from './event';
import { EventId } from './values';

export abstract class EventRepository {
  abstract findAll(): Promise<Event[]>;
  abstract findById(id: EventId): Promise<Event | null>;
}
