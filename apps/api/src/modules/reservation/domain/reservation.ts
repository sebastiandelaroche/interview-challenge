import { AggregateRoot, DomainRuleException } from '@shared/domain';
import { ReservationExpiredException } from './reservation.exceptions';
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
  now: Date;
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
  static readonly HOLD_MINUTES = 10;

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

  get expiresAt(): Date {
    return new Date(
      this.createdAt.getTime() + Reservation.HOLD_MINUTES * 60_000,
    );
  }

  isExpired(now: Date): boolean {
    return (
      this.status === 'expired' ||
      (this.status === 'on-hold' && now >= this.expiresAt)
    );
  }

  confirm(now: Date): void {
    if (this.status === 'confirmed')
      throw new DomainRuleException('Reservation is already confirmed');
    if (this.status === 'cancelled')
      throw new DomainRuleException('Reservation is cancelled');
    if (this.isExpired(now)) throw new ReservationExpiredException();

    this.status = ReservationStatus.create('confirmed');
    this.updatedAt = now;
    this.record({ type: 'ReservationConfirmed', occurredAt: now });
  }

  // Only an active (non-expired) hold can be cancelled.
  cancel(now: Date): void {
    if (this.status === 'confirmed')
      throw new DomainRuleException('Reservation is already confirmed');
    if (this.status === 'cancelled')
      throw new DomainRuleException('Reservation is already cancelled');
    if (this.isExpired(now))
      throw new DomainRuleException('Reservation has expired');

    this.status = ReservationStatus.create('cancelled');
    this.updatedAt = now;
    this.record({ type: 'ReservationCancelled', occurredAt: now });
  }

  static create(input: CreateReservation): Reservation {
    const { now } = input;
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
