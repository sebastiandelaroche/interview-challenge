import { EventView } from './event.view';

export abstract class EventReadModel {
  abstract findAll(now: Date): Promise<EventView[]>;
  abstract findById(id: string, now: Date): Promise<EventView | null>;
}
