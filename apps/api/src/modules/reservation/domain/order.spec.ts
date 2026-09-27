import {
  EventId,
  EventName,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import { Order } from './order';
import {
  CustomerEmail,
  CustomerFullName,
  ReservationId,
  TicketsQuantity,
  TicketTierId,
} from './values';

const now = new Date('2026-01-01T10:00:00Z');

const makeOrder = (price: number, quantity: number) =>
  Order.create({
    eventId: EventId.generate(),
    eventName: EventName.create('Rock Night'),
    ticketTierId: TicketTierId.from('11111111-1111-4111-8111-111111111111'),
    ticketTierName: TicketTierName.create('VIP'),
    ticketsQuantity: TicketsQuantity.create(quantity),
    ticketUnitPrice: TicketTierPrice.create(price),
    customerName: CustomerFullName.create('Jane Doe'),
    customerEmail: CustomerEmail.create('jane@example.com'),
    reservationId: ReservationId.generate(),
    now,
  });

describe('Order', () => {
  it('computes the total as unit price times quantity', () => {
    expect(makeOrder(50, 4).totalPaid).toBe(200);
  });

  it('rounds the total to cents', () => {
    // 3 * 19.99 is 59.970000000000006 in floating point.
    expect(makeOrder(19.99, 3).totalPaid).toBe(59.97);
    expect(makeOrder(0.1, 3).totalPaid).toBe(0.3);
  });

  it('keeps a snapshot of the event and tier', () => {
    const order = makeOrder(50, 1);

    expect(order.eventName).toBe('Rock Night');
    expect(order.ticketTierName).toBe('VIP');
    expect(order.ticketUnitPrice).toBe(50);
    expect(order.createdAt).toEqual(now);
    expect(order.pullEvents()).toEqual([
      { type: 'OrderCreated', occurredAt: now },
    ]);
  });

  it('hydrates a stored order as-is', () => {
    const order = makeOrder(50, 2);

    const restored = Order.hydrate({ ...order, id: order.id });

    expect(restored).toMatchObject({
      id: order.id,
      totalPaid: 100,
      createdAt: now,
    });
    expect(restored.pullEvents()).toEqual([]);
  });
});
