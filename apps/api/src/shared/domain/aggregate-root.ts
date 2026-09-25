import { DomainEvent } from './domain-event';
import { Entity, EntityId } from './entity';

export abstract class AggregateRoot<TId extends EntityId> extends Entity<TId> {
  private _events: DomainEvent[] = [];

  protected record(event: DomainEvent): void {
    this._events.push(event);
  }

  pullEvents(): DomainEvent[] {
    const events = this._events;
    this._events = [];
    return events;
  }
}
