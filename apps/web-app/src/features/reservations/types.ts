export type ReservationStatus =
  "on-hold" | "confirmed" | "expired" | "cancelled";

export type Customer = { fullName: string; email: string };
export type ReservationTier = { id: string; name: string; unitPrice: number };

export type Reservation = {
  id: string;
  eventId: string;
  tier: ReservationTier;
  ticketsQuantity: number;
  totalPrice: number;
  customer: Customer;
  status: ReservationStatus;
  createdAt: string;
  expiresAt: string;
};

export type Order = {
  id: string;
  reservationId: string;
  event: { id: string; name: string };
  tier: ReservationTier;
  ticketsQuantity: number;
  totalPrice: number;
  customer: Customer;
  status: ReservationStatus;
  createdAt: string;
};

export type CreateReservationRequest = {
  eventId: string;
  ticketTierId: string;
  ticketsQuantity: number;
  customerFullName: string;
  customerEmail: string;
};
