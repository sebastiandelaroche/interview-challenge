import {
  Event,
  EventDate,
  EventLocation,
  EventName,
  TicketTier,
  TicketTierCapacity,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import {
  CustomerEmail,
  CustomerFullName,
  Reservation,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { toCreateReservationOutput } from './create-reservation.dto';

describe('toCreateReservationOutput', () => {
  it('maps the event, tier and reservation to the API response shape', () => {
    const now = new Date('2026-01-01T10:00:00Z');
    const tier = TicketTier.create({
      name: TicketTierName.create('VIP'),
      capacity: TicketTierCapacity.create(10),
      price: TicketTierPrice.create(19.99),
    });
    const event = Event.create({
      name: EventName.create('Rock Night'),
      date: EventDate.create(new Date(Date.now() + 86_400_000)),
      location: EventLocation.create('Arena'),
      tiers: [tier],
    });
    const reservation = Reservation.create({
      customerFullName: CustomerFullName.create('Jane Doe'),
      customerEmail: CustomerEmail.create('jane@example.com'),
      ticketTierId: TicketTierId.from(tier.id),
      ticketsQuantity: TicketsQuantity.create(3),
      now,
    });

    expect(toCreateReservationOutput(event, tier, reservation)).toEqual({
      id: reservation.id,
      event: { id: event.id, name: 'Rock Night' },
      tier: { id: tier.id, name: 'VIP', unitPrice: 19.99 },
      ticketsQuantity: 3,
      totalPrice: 59.97,
      customer: { fullName: 'Jane Doe', email: 'jane@example.com' },
      status: 'on-hold',
      createdAt: now,
      expiresAt: new Date('2026-01-01T10:10:00Z'),
    });
  });
});
