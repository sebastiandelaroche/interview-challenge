import { Order, ReservationStatus } from '@modules/reservation/domain';

export type ConfirmReservationInput = {
  reservationId: string;
};

export type ConfirmReservationOutput = {
  id: string;
  reservationId: string;
  event: {
    id: string;
    name: string;
  };
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
};

export const toConfirmReservationOutput = (
  order: Order,
  status: ReservationStatus,
): ConfirmReservationOutput => {
  return {
    id: order.id,
    reservationId: order.reservationId,
    event: {
      id: order.eventId,
      name: order.eventName,
    },
    tier: {
      id: order.ticketTierId,
      name: order.ticketTierName,
      unitPrice: order.ticketUnitPrice,
    },
    ticketsQuantity: order.ticketsQuantity,
    totalPrice: order.totalPaid,
    customer: {
      fullName: order.customerName,
      email: order.customerEmail,
    },
    status,
    createdAt: order.createdAt,
  };
};
