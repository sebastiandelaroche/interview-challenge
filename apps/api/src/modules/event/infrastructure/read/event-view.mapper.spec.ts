import Decimal from 'decimal.js';
import { EventTierRow, EventViewMapper } from './event-view.mapper';

const date = new Date('2030-06-01T20:00:00Z');

const row = (overrides: Partial<EventTierRow>): EventTierRow =>
  ({
    event_id: 'e1',
    event_name: 'Rock Night',
    event_date: date,
    event_location: 'Arena',
    event_description: '',
    tier_id: 't1',
    tier_name: 'General',
    tier_price: new Decimal('25.50'),
    tier_capacity: 10,
    taken: 0,
    ...overrides,
  }) as EventTierRow;

describe('EventViewMapper', () => {
  it('groups one row per tier back into a single event', () => {
    const views = EventViewMapper.toViews([
      row({ tier_id: 't1', tier_name: 'General', taken: 3 }),
      row({ tier_id: 't2', tier_name: 'VIP', taken: 0 }),
    ]);

    expect(views).toEqual([
      {
        id: 'e1',
        name: 'Rock Night',
        date,
        location: 'Arena',
        description: '',
        tiers: [
          {
            id: 't1',
            name: 'General',
            price: 25.5,
            capacity: 10,
            available: 7,
          },
          { id: 't2', name: 'VIP', price: 25.5, capacity: 10, available: 10 },
        ],
      },
    ]);
  });

  it('keeps events in row order', () => {
    const views = EventViewMapper.toViews([
      row({ event_id: 'e1' }),
      row({ event_id: 'e2' }),
    ]);

    expect(views.map((v) => v.id)).toEqual(['e1', 'e2']);
  });

  it('returns an event with no tiers when the join found none', () => {
    const [view] = EventViewMapper.toViews([
      row({
        tier_id: null,
        tier_name: null,
        tier_price: null,
        tier_capacity: null,
      }),
    ]);

    expect(view.tiers).toEqual([]);
  });

  it('never reports negative availability', () => {
    const [view] = EventViewMapper.toViews([row({ taken: 12 })]);

    expect(view.tiers[0].available).toBe(0);
  });
});
