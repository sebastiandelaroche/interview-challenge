import Decimal from 'decimal.js';
import { EventId, TicketTierId } from '@modules/event/domain';
import { PostgresService } from '@shared/infrastructure/database';
import { PostgresEventImplRepo } from './postgres-event-impl.repo';

const at = new Date('2030-01-01T10:00:00Z');
const row = {
  id: 'e1',
  name: 'Rock Night',
  date: at,
  location: 'Arena',
  description: '',
  createdAt: at,
  updatedAt: at,
  tiers: [
    {
      id: 't1',
      name: 'VIP',
      capacity: 5,
      price: new Decimal(10),
      createdAt: at,
      updatedAt: at,
    },
  ],
};

const setup = () => {
  const prisma = {
    event: { findUnique: jest.fn(), findFirstOrThrow: jest.fn() },
  };
  const repo = new PostgresEventImplRepo(prisma as unknown as PostgresService);
  return { repo, prisma };
};

describe('PostgresEventImplRepo', () => {
  it('findById loads the event with its tiers', async () => {
    const { repo, prisma } = setup();
    prisma.event.findUnique.mockResolvedValue(row);

    const event = await repo.findById('e1' as EventId);

    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: 'e1' },
      include: { tiers: { orderBy: { createdAt: 'asc' } } },
    });
    expect(event?.id).toBe('e1');
    expect(event?.tiers[0].price).toBe(10);
  });

  it('findById returns null when there is no such event', async () => {
    const { repo, prisma } = setup();
    prisma.event.findUnique.mockResolvedValue(null);

    await expect(repo.findById('e1' as EventId)).resolves.toBeNull();
  });

  it('getByTicketTierId finds the event that owns the tier', async () => {
    const { repo, prisma } = setup();
    prisma.event.findFirstOrThrow.mockResolvedValue(row);

    const event = await repo.getByTicketTierId('t1' as TicketTierId);

    expect(prisma.event.findFirstOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tiers: { some: { id: 't1' } } } }),
    );
    expect(event.id).toBe('e1');
  });
});
