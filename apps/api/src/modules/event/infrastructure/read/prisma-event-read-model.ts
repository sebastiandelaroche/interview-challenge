import { Injectable } from '@nestjs/common';
import { Prisma, PostgresService } from '@shared/infrastructure/database';
import { EventReadModel, EventView } from '../../application/read-models';
import { EventTierRow, EventViewMapper } from './event-view.mapper';

@Injectable()
export class PrismaEventReadModel implements EventReadModel {
  constructor(private readonly prisma: PostgresService) {}

  async findAll(now: Date): Promise<EventView[]> {
    return EventViewMapper.toViews(await this.query(now, Prisma.empty));
  }

  async findById(id: string, now: Date): Promise<EventView | null> {
    const rows = await this.query(now, Prisma.sql`WHERE e.id = ${id}::uuid`);
    return EventViewMapper.toViews(rows)[0] ?? null;
  }

  // "Taken" must match PostgresReservationImplRepo.sumTakenTickets: confirmed
  // reservations plus holds still inside the hold window.
  private query(now: Date, where: Prisma.Sql): Promise<EventTierRow[]> {
    return this.prisma.$queryRaw<EventTierRow[]>`
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
           OR (status = 'on-hold' AND expires_at > ${now}::timestamptz)
        GROUP BY ticket_tier_id
      ) r ON r.ticket_tier_id = t.id
      ${where}
      ORDER BY e.date ASC, e.id, t.created_at ASC
    `;
  }
}
