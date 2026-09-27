import {
  CustomerEmail,
  CustomerFullName,
  Reservation,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { ReservationMapper } from './reservation.mapper';

const now = new Date('2026-01-01T10:00:00Z');

describe('ReservationMapper', () => {
  it.each([
    ['on-hold', 'ON_HOLD'],
    ['confirmed', 'CONFIRMED'],
    ['expired', 'EXPIRED'],
    ['cancelled', 'CANCELLED'],
  ] as const)('maps status %s to %s', (domain, prisma) => {
    expect(ReservationMapper.toStatus(domain)).toBe(prisma);
  });

  it('round-trips a reservation through persistence', () => {
    const reservation = Reservation.create({
      customerFullName: CustomerFullName.create('Jane Doe'),
      customerEmail: CustomerEmail.create('jane@example.com'),
      ticketTierId: TicketTierId.from('11111111-1111-4111-8111-111111111111'),
      ticketsQuantity: TicketsQuantity.create(2),
      now,
    });

    const row = ReservationMapper.toPersistence(reservation);
    expect(row).toMatchObject({ status: 'ON_HOLD', ticketsQuantity: 2 });

    const restored = ReservationMapper.toDomain(
      row as Parameters<typeof ReservationMapper.toDomain>[0],
    );
    expect(restored).toMatchObject({
      id: reservation.id,
      status: 'on-hold',
      customerEmail: 'jane@example.com',
      expiresAt: reservation.expiresAt,
    });
  });
});
