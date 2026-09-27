import { randomUUID } from 'node:crypto';
import { TestApp } from './test-app';

export const resetDb = async ({ postgres, mongo }: TestApp): Promise<void> => {
  await postgres.$executeRawUnsafe(
    'TRUNCATE TABLE reservations, ticket_tiers, events CASCADE',
  );
  await mongo.collection('orders').deleteMany({});
};

// Inserts one event with a single tier straight into Postgres.
export const seedEvent = async (
  { postgres }: TestApp,
  { capacity = 10, price = 25 } = {},
) => {
  const eventId = randomUUID();
  const tierId = randomUUID();
  await postgres.event.create({
    data: {
      id: eventId,
      name: 'Rock Night',
      date: new Date('2030-06-01T20:00:00Z'),
      location: 'Arena',
      tiers: { create: { id: tierId, name: 'General', capacity, price } },
    },
  });
  return { eventId, tierId };
};
