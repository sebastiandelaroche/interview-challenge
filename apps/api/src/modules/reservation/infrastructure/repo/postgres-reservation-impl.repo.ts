import { Injectable } from '@nestjs/common';
import {
  LockedTierReservations,
  Reservation,
  ReservationId,
  ReservationRepository,
  TicketTierId,
} from '@modules/reservation/domain';
import { Prisma, PrismaService } from '@shared/infrastructure/database';
import { ReservationMapper } from './reservation.mapper';

type Db = PrismaService | Prisma.TransactionClient;

@Injectable()
export class PostgresReservationImplRepo implements ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

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
            AND created_at > ${now}::timestamptz - make_interval(mins => ${Reservation.HOLD_MINUTES}::int)
          )
        )
    `;
    return taken;
  }
}
