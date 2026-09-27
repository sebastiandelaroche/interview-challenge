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
  ReservationStatus,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { toConfirmReservationOutput } from './confirm-reservation.dto';

describe('toConfirmReservationOutput', () => {
  it('maps an order to the API response shape', () => {
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

    expect(
      toConfirmReservationOutput(order, ReservationStatus.create('confirmed')),
    ).toEqual({
      id: order.id,
      reservationId: order.reservationId,
      event: { id: order.eventId, name: 'Rock Night' },
      tier: { id: order.ticketTierId, name: 'VIP', unitPrice: 50 },
      ticketsQuantity: 2,
      totalPrice: 100,
      customer: { fullName: 'Jane Doe', email: 'jane@example.com' },
      status: 'confirmed',
      createdAt: now,
    });
  });
});
