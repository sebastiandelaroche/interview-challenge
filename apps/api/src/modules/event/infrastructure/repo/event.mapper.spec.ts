import Decimal from 'decimal.js';
import { EventMapper, PrismaEventWithTiers } from './event.mapper';

const at = new Date('2020-01-01T10:00:00Z');

const row = {
  id: 'e1',
  name: 'Rock Night',
  date: at, // in the past: stored data is not re-validated
  location: 'Arena',
  description: 'Loud',
  createdAt: at,
  updatedAt: at,
  tiers: [
    {
      id: 't1',
      eventId: 'e1',
      name: 'VIP',
      capacity: 50,
      price: new Decimal('19.99'),
      createdAt: at,
      updatedAt: at,
    },
  ],
} as unknown as PrismaEventWithTiers;

describe('EventMapper', () => {
  it('turns a Prisma row into an Event aggregate', () => {
    const event = EventMapper.toDomain(row);

    expect(event).toMatchObject({
      id: 'e1',
      name: 'Rock Night',
      date: at,
      location: 'Arena',
      description: 'Loud',
    });
    expect(event.tiers).toHaveLength(1);
  });

  it('converts the Decimal price to a number', () => {
    const tier = EventMapper.tierToDomain(row.tiers[0]);

    expect(tier).toMatchObject({
      id: 't1',
      name: 'VIP',
      capacity: 50,
      price: 19.99,
    });
  });
});
