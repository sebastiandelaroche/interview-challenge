import { Prisma } from '@shared/infrastructure/database';
import { ReservationStatusValue } from '../../domain/values';
import { ReservationView } from '../../application/read-models';

export type ReservationRow = {
  id: string;
  tickets_quantity: number;
  status: ReservationStatusValue;
  created_at: Date;
  expires_at: Date;
  customer_full_name: string;
  customer_email: string;
  tier_id: string;
  tier_name: string;
  tier_price: Prisma.Decimal;
  event_id: string;
  event_name: string;
};

export const ReservationViewMapper = {
  toView(row: ReservationRow): ReservationView {
    const unitPrice = Number(row.tier_price);
    return {
      id: row.id,
      ticketsQuantity: row.tickets_quantity,
      totalPrice: Math.round(unitPrice * row.tickets_quantity * 100) / 100,
      status: row.status,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      event: { id: row.event_id, name: row.event_name },
      tier: { id: row.tier_id, name: row.tier_name, unitPrice },
      customer: { fullName: row.customer_full_name, email: row.customer_email },
    };
  },
};
