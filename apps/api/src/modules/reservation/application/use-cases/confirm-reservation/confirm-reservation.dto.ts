import { Reservation } from '@modules/reservation/domain';

export type ConfirmReservationInput = {
  reservationId: string;
};

export type ConfirmReservationOutput = {
  id: string;
  ticketTierId: string;
  ticketsQuantity: number;
  customer: {
    fullName: string;
    email: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const toConfirmReservationOutput = (
  reservation: Reservation,
): ConfirmReservationOutput => {
  return {
    id: reservation.id,
    ticketTierId: reservation.ticketTierId,
    ticketsQuantity: reservation.ticketsQuantity,
    customer: {
      fullName: reservation.customerFullName,
      email: reservation.customerEmail,
    },
    status: reservation.status,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };
};
