import { AggregateRoot } from '@shared/domain';
import {
  EventId,
  EventName,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import {
  CustomerEmail,
  CustomerFullName,
  OrderId,
  ReservationId,
  TicketsQuantity,
  TicketTierId,
} from './values';

// Snapshot of what was purchased: event/tier names and prices are copied so the
// order stays accurate even if the event catalog changes later.
type OrderProps = {
  eventId: EventId;
  eventName: EventName;
  ticketTierId: TicketTierId;
  ticketTierName: TicketTierName;
  ticketsQuantity: TicketsQuantity;
  ticketUnitPrice: TicketTierPrice;
  customerName: CustomerFullName;
  customerEmail: CustomerEmail;
  reservationId: ReservationId;
};

type CreateOrder = OrderProps & { now: Date };

type HydrateOrder = OrderProps & {
  id: OrderId;
  totalPaid: number;
  createdAt: Date;
  updatedAt: Date;
};

export class Order extends AggregateRoot<OrderId> {
  private constructor(
    id: OrderId,
    public readonly eventId: EventId,
    public readonly eventName: EventName,
    public readonly ticketTierId: TicketTierId,
    public readonly ticketTierName: TicketTierName,
    public readonly ticketsQuantity: TicketsQuantity,
    public readonly ticketUnitPrice: TicketTierPrice,
    public readonly totalPaid: number,
    public readonly customerName: CustomerFullName,
    public readonly customerEmail: CustomerEmail,
    public readonly reservationId: ReservationId,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id);
  }

  static create(input: CreateOrder): Order {
    const { now } = input;
    const order = new Order(
      OrderId.generate(),
      input.eventId,
      input.eventName,
      input.ticketTierId,
      input.ticketTierName,
      input.ticketsQuantity,
      input.ticketUnitPrice,
      // Round to cents to avoid floating point drift (e.g. 3 * 19.99).
      Math.round(input.ticketUnitPrice * input.ticketsQuantity * 100) / 100,
      input.customerName,
      input.customerEmail,
      input.reservationId,
      now,
      now,
    );

    order.record({ type: 'OrderCreated', occurredAt: now });
    return order;
  }

  static hydrate(input: HydrateOrder): Order {
    return new Order(
      input.id,
      input.eventId,
      input.eventName,
      input.ticketTierId,
      input.ticketTierName,
      input.ticketsQuantity,
      input.ticketUnitPrice,
      input.totalPaid,
      input.customerName,
      input.customerEmail,
      input.reservationId,
      input.createdAt,
      input.updatedAt,
    );
  }
}
