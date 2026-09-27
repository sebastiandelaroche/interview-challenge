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
import { MongoService } from '@shared/infrastructure/database';
import { MongoOrderImplRepo } from './mongo-order-impl.repo';

describe('MongoOrderImplRepo', () => {
  it('upserts the order into the orders collection by its id', async () => {
    const orders = { replaceOne: jest.fn() };
    const mongo = { collection: jest.fn().mockReturnValue(orders) };
    const repo = new MongoOrderImplRepo(mongo as unknown as MongoService);
    const order = Order.create({
      eventId: EventId.generate(),
      eventName: EventName.create('Rock Night'),
      ticketTierId: TicketTierId.from('11111111-1111-4111-8111-111111111111'),
      ticketTierName: TicketTierName.create('VIP'),
      ticketsQuantity: TicketsQuantity.create(1),
      ticketUnitPrice: TicketTierPrice.create(50),
      customerName: CustomerFullName.create('Jane Doe'),
      customerEmail: CustomerEmail.create('jane@example.com'),
      reservationId: ReservationId.generate(),
      now: new Date(),
    });

    await repo.save(order);

    expect(mongo.collection).toHaveBeenCalledWith('orders');
    const [filter, data, options] = orders.replaceOne.mock.calls[0];
    expect(filter._id.toHexString()).toBe(order.id);
    expect(data).not.toHaveProperty('_id');
    expect(data).toMatchObject({ reservationId: order.reservationId });
    expect(options).toEqual({ upsert: true });
  });
});
