export type ReservationStatus =
  "on-hold" | "confirmed" | "expired" | "cancelled";

export type Customer = { fullName: string; email: string };
export type ReservationEvent = { id: string; name: string };
export type ReservationTier = { id: string; name: string; unitPrice: number };

export type Reservation = {
  id: string;
  event: ReservationEvent;
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
  event: ReservationEvent;
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
