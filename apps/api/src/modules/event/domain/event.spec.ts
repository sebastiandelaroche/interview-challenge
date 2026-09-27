import { DomainRuleException } from '@shared/domain';
import { Event } from './event';
import { TicketTier } from './ticket-tier';
import {
  EventDate,
  EventId,
  EventLocation,
  EventName,
  TicketTierCapacity,
  TicketTierName,
  TicketTierPrice,
} from './values';

const tier = () =>
  TicketTier.create({
    name: TicketTierName.create('General'),
    capacity: TicketTierCapacity.create(100),
    price: TicketTierPrice.create(25),
  });

const props = () => ({
  name: EventName.create('Rock Night'),
  date: EventDate.create(new Date(Date.now() + 86_400_000)),
  location: EventLocation.create('Arena'),
});

describe('Event', () => {
  it('creates an event with its tiers and records EventCreated', () => {
    const tiers = [tier()];

    const event = Event.create({ ...props(), description: '  Loud ', tiers });

    expect(event.description).toBe('Loud');
    expect(event.tiers).toBe(tiers);
    expect(event.pullEvents()).toEqual([
      { type: 'EventCreated', occurredAt: event.createdAt },
    ]);
  });

  it('defaults the description to an empty string', () => {
    expect(Event.create({ ...props(), tiers: [tier()] }).description).toBe('');
  });

  it('requires at least one tier', () => {
    expect(() => Event.create({ ...props(), tiers: [] })).toThrow(
      DomainRuleException,
    );
  });

  it('hydrates a stored event without re-running creation rules', () => {
    const at = new Date('2020-01-01T10:00:00Z');
    const id = EventId.generate();

    const event = Event.hydrate({
      ...props(),
      id,
      date: at as EventDate, // past dates are fine when reading
      description: '',
      tiers: [],
      createdAt: at,
      updatedAt: at,
    });

    expect(event).toMatchObject({ id, date: at, tiers: [] });
    expect(event.pullEvents()).toEqual([]);
  });
});
