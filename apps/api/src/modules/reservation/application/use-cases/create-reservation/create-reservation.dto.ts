import { Event, TicketTier, TicketTierPrice } from '@modules/event/domain';
import { Reservation } from '@modules/reservation/domain';
import { ReservationView } from '../../read-models';

export type CreateReservationInput = {
  eventId: string;
  ticketTierId: string;
  ticketsQuantity: number;
  customerFullName: string;
  customerEmail: string;
};

export type CreateReservationOutput = ReservationView;

export const toCreateReservationOutput = (
  event: Event,
  tier: TicketTier,
  reservation: Reservation,
): CreateReservationOutput => {
  return {
    id: reservation.id,
    event: {
      id: event.id,
      name: event.name,
    },
    tier: {
      id: tier.id,
      name: tier.name,
      unitPrice: tier.price,
    },
    ticketsQuantity: reservation.ticketsQuantity,
    totalPrice: TicketTierPrice.total(tier.price, reservation.ticketsQuantity),
    customer: {
      fullName: reservation.customerFullName,
      email: reservation.customerEmail,
    },
    status: reservation.status,
    createdAt: reservation.createdAt,
    expiresAt: reservation.expiresAt,
  };
};
