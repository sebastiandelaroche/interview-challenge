import { Injectable } from '@nestjs/common';
import {
  LockedReservation,
  LockedTierReservations,
  Reservation,
  ReservationId,
  ReservationRepository,
  TicketTierId,
} from '@modules/reservation/domain';
import { Prisma, PostgresService } from '@shared/infrastructure/database';
import { ReservationMapper } from './reservation.mapper';

type Db = PostgresService | Prisma.TransactionClient;

@Injectable()
export class PostgresReservationImplRepo implements ReservationRepository {
  constructor(private readonly prisma: PostgresService) {}

  async findById(id: ReservationId): Promise<Reservation | null> {
    const row = await this.prisma.reservation.findUnique({ where: { id } });
    return row ? ReservationMapper.toDomain(row) : null;
  }

  save(reservation: Reservation): Promise<void> {
    return this.upsert(this.prisma, reservation);
  }

  withTicketTierLock<T>(
    ticketTierId: TicketTierId,
    work: (locked: LockedTierReservations) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      // Row lock on the tier acts as a per-tier mutex until the transaction ends.
      await tx.$queryRaw`SELECT id FROM ticket_tiers WHERE id = ${ticketTierId}::uuid FOR UPDATE`;

      return work({
        sumTakenTickets: (now) => this.sumTakenTickets(tx, ticketTierId, now),
        save: (reservation) => this.upsert(tx, reservation),
      });
    });
  }

  withReservationLock<T>(
    id: ReservationId,
    work: (locked: LockedReservation) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM reservations WHERE id = ${id}::uuid FOR UPDATE`;
      const row = await tx.reservation.findUnique({ where: { id } });

      return work({
        reservation: row ? ReservationMapper.toDomain(row) : null,
        save: (reservation) => this.upsert(tx, reservation),
      });
    });
  }

  // Status sync only: availability and domain rules already treat lapsed holds as expired.
  // Rows locked by a concurrent confirm/cancel are re-checked after the lock is released.
  expireLapsedHolds(now: Date): Promise<number> {
    return this.prisma.$executeRaw`
      UPDATE reservations
      SET status = 'expired', updated_at = ${now}::timestamptz
      WHERE status = 'on-hold'
        AND expires_at <= ${now}::timestamptz
    `;
  }

  private async upsert(db: Db, reservation: Reservation): Promise<void> {
    const data = ReservationMapper.toPersistence(reservation);
    await db.reservation.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  private async sumTakenTickets(
    db: Db,
    ticketTierId: TicketTierId,
    now: Date,
  ): Promise<number> {
    const [{ taken }] = await db.$queryRaw<{ taken: number }[]>`
      SELECT COALESCE(SUM(tickets_quantity), 0)::int AS taken
      FROM reservations
      WHERE ticket_tier_id = ${ticketTierId}::uuid
        AND (
          status = 'confirmed'
          OR (
            status = 'on-hold'
            AND expires_at > ${now}::timestamptz
          )
        )
    `;
    return taken;
  }
}
