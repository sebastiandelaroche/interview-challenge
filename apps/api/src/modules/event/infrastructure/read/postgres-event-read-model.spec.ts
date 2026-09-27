import { PostgresService } from '@shared/infrastructure/database';
import { PostgresEventReadModel } from './postgres-event-read-model';

const now = new Date('2026-01-01T10:00:00Z');
const row = {
  event_id: 'e1',
  event_name: 'Rock Night',
  event_date: now,
  event_location: 'Arena',
  event_description: '',
  tier_id: 't1',
  tier_name: 'VIP',
  tier_price: 10,
  tier_capacity: 5,
  taken: 2,
};

// $queryRaw is a tagged template: the mock receives (strings, ...values).
const setup = (rows: unknown[]) => {
  const prisma = { $queryRaw: jest.fn().mockResolvedValue(rows) };
  const readModel = new PostgresEventReadModel(
    prisma as unknown as PostgresService,
  );
  const sql = () => {
    const strings = prisma.$queryRaw.mock.calls[0][0] as string[];
    return strings.join('?');
  };
  return { readModel, prisma, sql };
};

describe('PostgresEventReadModel', () => {
  it('findAll maps rows to views, counting only confirmed and active holds', async () => {
    const { readModel, prisma, sql } = setup([row]);

    const views = await readModel.findAll(now);

    expect(views[0].tiers[0].available).toBe(3);
    expect(sql()).toContain("status = 'confirmed'");
    expect(sql()).toContain("status = 'on-hold' AND expires_at >");
    expect(prisma.$queryRaw.mock.calls[0]).toContain(now);
  });

  it('findById returns the matching event', async () => {
    const { readModel } = setup([row]);

    await expect(readModel.findById('e1', now)).resolves.toMatchObject({
      id: 'e1',
    });
  });

  it('findById returns null when nothing matches', async () => {
    const { readModel } = setup([]);

    await expect(readModel.findById('e1', now)).resolves.toBeNull();
  });
});
