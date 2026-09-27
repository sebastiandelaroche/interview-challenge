import {
  CustomerEmail,
  CustomerFullName,
  Reservation,
  ReservationId,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { PostgresService } from '@shared/infrastructure/database';
import { ReservationMapper } from './reservation.mapper';
import { PostgresReservationImplRepo } from './postgres-reservation-impl.repo';

const now = new Date('2026-01-01T10:00:00Z');
const tierId = TicketTierId.from('11111111-1111-4111-8111-111111111111');

const makeReservation = () =>
  Reservation.create({
    customerFullName: CustomerFullName.create('Jane Doe'),
    customerEmail: CustomerEmail.create('jane@example.com'),
    ticketTierId: tierId,
    ticketsQuantity: TicketsQuantity.create(2),
    now,
  });

// Fake Prisma client: $transaction runs the callback with the same fake as `tx`.
const setup = () => {
  const db = {
    $queryRaw: jest.fn().mockResolvedValue([]),
    $executeRaw: jest.fn(),
    reservation: { findUnique: jest.fn(), upsert: jest.fn() },
    $transaction: jest.fn((work: (tx: unknown) => unknown) => work(db)),
  };
  const repo = new PostgresReservationImplRepo(
    db as unknown as PostgresService,
  );
  const sqlOf = (call: number) =>
    (db.$queryRaw.mock.calls[call][0] as string[]).join('?');
  return { repo, db, sqlOf };
};

describe('PostgresReservationImplRepo', () => {
  it('findById maps the stored row to a Reservation', async () => {
    const { repo, db } = setup();
    const reservation = makeReservation();
    db.reservation.findUnique.mockResolvedValue(
      ReservationMapper.toPersistence(reservation),
    );

    const found = await repo.findById(reservation.id);

    expect(found?.id).toBe(reservation.id);
  });

  it('findById returns null when there is no such reservation', async () => {
    const { repo, db } = setup();
    db.reservation.findUnique.mockResolvedValue(null);

    await expect(repo.findById(ReservationId.generate())).resolves.toBeNull();
  });

  it('withTicketTierLock locks the tier row, then sums and saves inside the transaction', async () => {
    const { repo, db, sqlOf } = setup();
    db.$queryRaw
      .mockResolvedValueOnce([]) // FOR UPDATE
      .mockResolvedValueOnce([{ taken: 4 }]); // SUM
    const reservation = makeReservation();

    const taken = await repo.withTicketTierLock(tierId, async (locked) => {
      const sum = await locked.sumTakenTickets(now);
      await locked.save(reservation);
      return sum;
    });

    expect(taken).toBe(4);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
    expect(sqlOf(0)).toContain('FROM ticket_tiers WHERE id =');
    expect(sqlOf(0)).toContain('FOR UPDATE');
    expect(sqlOf(1)).toContain('SUM(tickets_quantity)');
    expect(db.reservation.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: reservation.id } }),
    );
  });

  it('withReservationLock locks the row and hands over the reservation', async () => {
    const { repo, db, sqlOf } = setup();
    const reservation = makeReservation();
    db.reservation.findUnique.mockResolvedValue(
      ReservationMapper.toPersistence(reservation),
    );

    const status = await repo.withReservationLock(
      reservation.id,
      async (locked) => {
        locked.reservation!.cancel(now);
        await locked.save(locked.reservation!);
        return locked.reservation!.status;
      },
    );

    expect(status).toBe('cancelled');
    expect(sqlOf(0)).toContain('FROM reservations WHERE id =');
    expect(sqlOf(0)).toContain('FOR UPDATE');
    expect(db.reservation.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ status: 'CANCELLED' }),
      }),
    );
  });

  it('withReservationLock passes null when the reservation does not exist', async () => {
    const { repo, db } = setup();
    db.reservation.findUnique.mockResolvedValue(null);

    const found = await repo.withReservationLock(
      ReservationId.generate(),
      async (locked) => locked.reservation,
    );

    expect(found).toBeNull();
  });

  it('expireLapsedHolds marks on-hold rows past expiry as expired', async () => {
    const { repo, db } = setup();
    db.$executeRaw.mockResolvedValue(2);

    await expect(repo.expireLapsedHolds(now)).resolves.toBe(2);
    const sql = (db.$executeRaw.mock.calls[0][0] as string[]).join('?');
    expect(sql).toContain("SET status = 'expired'");
    expect(sql).toContain("WHERE status = 'on-hold' AND expires_at <=");
  });
});
