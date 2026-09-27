import { ReservationStatusValue } from '../../domain/values';

export type ReservationView = {
  id: string;
  ticketsQuantity: number;
  totalPrice: number;
  status: ReservationStatusValue;
  createdAt: Date;
  expiresAt: Date;
  event: { id: string; name: string };
  tier: { id: string; name: string; unitPrice: number };
  customer: { fullName: string; email: string };
};
