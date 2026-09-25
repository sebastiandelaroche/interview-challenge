import { AggregateRoot, DomainRuleException } from '@shared/domain';
import { EventDate, EventId, EventName, EventLocation } from './values';
import { TicketTier } from './ticket-tier';

type CreateEvent = {
  name: EventName;
  date: EventDate;
  location: EventLocation;
  description?: string;
  tiers: TicketTier[];
};

type HydrateEvent = {
  id: EventId;
  name: EventName;
  date: EventDate;
  location: EventLocation;
  description: string;
  tiers: TicketTier[];
  createdAt: Date;
  updatedAt: Date;
};

export class Event extends AggregateRoot<EventId> {
  private constructor(
    id: EventId,
    public name: EventName,
    public date: EventDate,
    public location: EventLocation,
    public description: string,
    public tiers: TicketTier[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id);
  }

  static create(input: CreateEvent): Event {
    if (input.tiers.length === 0)
      throw new DomainRuleException('An event must have at least one tier');

    const now = new Date();
    const event = new Event(
      EventId.generate(),
      input.name,
      input.date,
      input.location,
      input.description?.trim() ?? '',
      input.tiers,
      now,
      now,
    );

    event.record({ type: 'EventCreated', occurredAt: now });
    return event;
  }

  static hydrate(input: HydrateEvent): Event {
    return new Event(
      input.id,
      input.name,
      input.date,
      input.location,
      input.description,
      input.tiers,
      input.createdAt,
      input.updatedAt,
    );
  }
}
