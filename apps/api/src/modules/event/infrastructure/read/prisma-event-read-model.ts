import { Injectable } from '@nestjs/common';
import { Reservation } from '@modules/reservation/domain';
import { Prisma, PostgresService } from '@shared/infrastructure/database';
import { EventReadModel, EventView } from '../../application/read-models';

type Row = {
  event_id: string;
  event_name: string;
  event_date: Date;
  event_location: string;
  event_description: string;
  tier_id: string | null;
  tier_name: string | null;
  tier_price: Prisma.Decimal | null;
  tier_capacity: number | null;
  taken: number;
};

@Injectable()
export class PrismaEventReadModel implements EventReadModel {
  constructor(private readonly prisma: PostgresService) {}

  async findAll(now: Date): Promise<EventView[]> {
    return this.toViews(await this.query(now, Prisma.empty));
  }

  async findById(id: string, now: Date): Promise<EventView | null> {
    const rows = await this.query(now, Prisma.sql`WHERE e.id = ${id}::uuid`);
    return this.toViews(rows)[0] ?? null;
  }

  // "Taken" must match PostgresReservationImplRepo.sumTakenTickets: confirmed
  // reservations plus holds still inside the hold window.
  private query(now: Date, where: Prisma.Sql): Promise<Row[]> {
    return this.prisma.$queryRaw<Row[]>`
      SELECT
        e.id          AS event_id,
        e.name        AS event_name,
        e.date        AS event_date,
        e.location    AS event_location,
        e.description AS event_description,
        t.id          AS tier_id,
        t.name        AS tier_name,
        t.price       AS tier_price,
        t.capacity    AS tier_capacity,
        COALESCE(r.taken, 0)::int AS taken
      FROM events e
      LEFT JOIN ticket_tiers t ON t.event_id = e.id
      LEFT JOIN (
        SELECT ticket_tier_id, SUM(tickets_quantity) AS taken
        FROM reservations
        WHERE status = 'confirmed'
           OR (
             status = 'on-hold'
             AND created_at > ${now}::timestamptz - make_interval(mins => ${Reservation.HOLD_MINUTES}::int)
           )
        GROUP BY ticket_tier_id
      ) r ON r.ticket_tier_id = t.id
      ${where}
      ORDER BY e.date ASC, e.id, t.created_at ASC
    `;
  }

  private toViews(rows: Row[]): EventView[] {
    const events = new Map<string, EventView>();
    for (const row of rows) {
      let event = events.get(row.event_id);
      if (!event) {
        event = {
          id: row.event_id,
          name: row.event_name,
          date: row.event_date,
          location: row.event_location,
          description: row.event_description,
          tiers: [],
        };
        events.set(row.event_id, event);
      }
      if (row.tier_id !== null) {
        const capacity = row.tier_capacity!;
        event.tiers.push({
          id: row.tier_id,
          name: row.tier_name!,
          price: Number(row.tier_price),
          capacity,
          available: Math.max(0, capacity - row.taken),
        });
      }
    }
    return [...events.values()];
  }
}
