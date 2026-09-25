import { AggregateRoot } from '@shared/domain';
import {
  CustomerEmail,
  CustomerFullName,
  ReservationId,
  ReservationStatus,
  TicketsQuantity,
  TicketTierId,
} from './values';

type CreateReservation = {
  customerFullName: CustomerFullName;
  customerEmail: CustomerEmail;
  ticketTierId: TicketTierId;
  ticketsQuantity: TicketsQuantity;
  status?: ReservationStatus;
};

type HydrateReservation = {
  id: ReservationId;
  customerFullName: CustomerFullName;
  customerEmail: CustomerEmail;
  ticketTierId: TicketTierId;
  ticketsQuantity: TicketsQuantity;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class Reservation extends AggregateRoot<ReservationId> {
  private constructor(
    id: ReservationId,
    public customerFullName: CustomerFullName,
    public customerEmail: CustomerEmail,
    public ticketTierId: TicketTierId,
    public ticketsQuantity: TicketsQuantity,
    public status: ReservationStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id);
  }

  static create(input: CreateReservation): Reservation {
    const now = new Date();
    const reservation = new Reservation(
      ReservationId.generate(),
      input.customerFullName,
      input.customerEmail,
      input.ticketTierId,
      input.ticketsQuantity,
      input.status ?? ReservationStatus.default(),
      now,
      now,
    );

    reservation.record({ type: 'ReservationCreated', occurredAt: now });
    return reservation;
  }

  static hydrate(input: HydrateReservation): Reservation {
    return new Reservation(
      input.id,
      input.customerFullName,
      input.customerEmail,
      input.ticketTierId,
      input.ticketsQuantity,
      input.status,
      input.createdAt,
      input.updatedAt,
    );
  }
}
