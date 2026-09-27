import { Injectable } from '@nestjs/common';
import { PostgresService } from '@shared/infrastructure/database';
import {
  ReservationReadModel,
  ReservationView,
} from '../../application/read-models';
import {
  ReservationRow,
  ReservationViewMapper,
} from './reservation-view.mapper';

@Injectable()
export class PostgresReservationReadModel implements ReservationReadModel {
  constructor(private readonly prisma: PostgresService) {}

  // A lapsed hold is reported as expired even before the sweep syncs its status.
  async findById(id: string, now: Date): Promise<ReservationView | null> {
    const [row] = await this.prisma.$queryRaw<ReservationRow[]>`
      SELECT
        r.id,
        r.tickets_quantity,
        CASE
          WHEN r.status = 'on-hold' AND r.expires_at <= ${now}::timestamptz
            THEN 'expired'
          ELSE r.status::text
        END AS status,
        r.created_at,
        r.expires_at,
        r.customer_full_name,
        r.customer_email,
        t.id    AS tier_id,
        t.name  AS tier_name,
        t.price AS tier_price,
        e.id    AS event_id,
        e.name  AS event_name
      FROM reservations r
      JOIN ticket_tiers t ON t.id = r.ticket_tier_id
      JOIN events e ON e.id = t.event_id
      WHERE r.id = ${id}::uuid
    `;
    return row ? ReservationViewMapper.toView(row) : null;
  }
}
