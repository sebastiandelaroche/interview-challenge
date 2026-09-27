import { PostgresService } from '@shared/infrastructure/database';
import { PostgresReservationReadModel } from './postgres-reservation-read-model';

const now = new Date('2026-01-01T10:00:00Z');

const setup = (rows: unknown[]) => {
  const prisma = { $queryRaw: jest.fn().mockResolvedValue(rows) };
  const readModel = new PostgresReservationReadModel(
    prisma as unknown as PostgresService,
  );
  return { readModel, prisma };
};

describe('PostgresReservationReadModel', () => {
  it('returns the mapped reservation, reporting lapsed holds as expired', async () => {
    const { readModel, prisma } = setup([
      {
        id: 'r1',
        tickets_quantity: 2,
        status: 'expired',
        tier_price: 10,
        tier_id: 't1',
        tier_name: 'VIP',
        event_id: 'e1',
        event_name: 'Rock Night',
      },
    ]);

    const view = await readModel.findById('r1', now);

    expect(view).toMatchObject({ id: 'r1', status: 'expired', totalPrice: 20 });
    const [strings, ...values] = prisma.$queryRaw.mock.calls[0];
    expect((strings as string[]).join('?')).toContain(
      "WHEN r.status = 'on-hold' AND r.expires_at <=",
    );
    expect(values).toEqual([now, 'r1']);
  });

  it('returns null when nothing matches', async () => {
    const { readModel } = setup([]);

    await expect(readModel.findById('r1', now)).resolves.toBeNull();
  });
});
