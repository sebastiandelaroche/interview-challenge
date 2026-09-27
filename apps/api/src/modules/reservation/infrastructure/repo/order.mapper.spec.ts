import { ObjectId } from 'mongodb';
import {
  EventId,
  EventName,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import {
  CustomerEmail,
  CustomerFullName,
  Order,
  ReservationId,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { OrderMapper } from './order.mapper';

describe('OrderMapper', () => {
  it('maps an order to a Mongo document keyed by ObjectId', () => {
    const now = new Date('2026-01-01T10:00:00Z');
    const order = Order.create({
      eventId: EventId.generate(),
      eventName: EventName.create('Rock Night'),
      ticketTierId: TicketTierId.from('11111111-1111-4111-8111-111111111111'),
      ticketTierName: TicketTierName.create('VIP'),
      ticketsQuantity: TicketsQuantity.create(2),
      ticketUnitPrice: TicketTierPrice.create(50),
      customerName: CustomerFullName.create('Jane Doe'),
      customerEmail: CustomerEmail.create('jane@example.com'),
      reservationId: ReservationId.generate(),
      now,
    });

    const doc = OrderMapper.toPersistence(order);

    expect(doc._id).toBeInstanceOf(ObjectId);
    expect(doc._id.toHexString()).toBe(order.id);
    expect(doc).toMatchObject({
      eventId: order.eventId,
      eventName: 'Rock Night',
      ticketTierName: 'VIP',
      ticketsQuantity: 2,
      ticketUnitPrice: 50,
      totalPaid: 100,
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      reservationId: order.reservationId,
      createdAt: now,
      updatedAt: now,
    });
  });
});
