import { Event, TicketTier } from '@modules/event/domain';
import { Reservation } from '@modules/reservation/domain';

export type CreateReservationInput = {
  eventId: string;
  ticketTierId: string;
  ticketsQuantity: number;
  customerFullName: string;
  customerEmail: string;
};

export type CreateReservationOutput = {
  id: string;
  eventId: string;
  tier: {
    id: string;
    name: string;
    unitPrice: number;
  };
  ticketsQuantity: number;
  totalPrice: number;
  customer: {
    fullName: string;
    email: string;
  };
  status: string;
  createdAt: Date;
  expiresAt: Date;
};

export const toCreateReservationOutput = (
  event: Event,
  tier: TicketTier,
  reservation: Reservation,
): CreateReservationOutput => {
  return {
    id: reservation.id,
    eventId: event.id,
    tier: {
      id: tier.id,
      name: tier.name,
      unitPrice: tier.price,
    },
    ticketsQuantity: reservation.ticketsQuantity,
    totalPrice:
      Math.round(tier.price * reservation.ticketsQuantity * 100) / 100,
    customer: {
      fullName: reservation.customerFullName,
      email: reservation.customerEmail,
    },
    status: reservation.status,
    createdAt: reservation.createdAt,
    expiresAt: reservation.expiresAt,
  };
};
