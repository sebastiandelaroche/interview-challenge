import Decimal from 'decimal.js';
import {
  ReservationRow,
  ReservationViewMapper,
} from './reservation-view.mapper';

describe('ReservationViewMapper', () => {
  it('maps a joined row to a view with the total price', () => {
    const at = new Date('2026-01-01T10:00:00Z');
    const row = {
      id: 'r1',
      tickets_quantity: 3,
      status: 'on-hold',
      created_at: at,
      expires_at: at,
      customer_full_name: 'Jane Doe',
      customer_email: 'jane@example.com',
      tier_id: 't1',
      tier_name: 'VIP',
      tier_price: new Decimal('19.99'),
      event_id: 'e1',
      event_name: 'Rock Night',
    } as unknown as ReservationRow;

    expect(ReservationViewMapper.toView(row)).toEqual({
      id: 'r1',
      ticketsQuantity: 3,
      totalPrice: 59.97,
      status: 'on-hold',
      createdAt: at,
      expiresAt: at,
      event: { id: 'e1', name: 'Rock Night' },
      tier: { id: 't1', name: 'VIP', unitPrice: 19.99 },
      customer: { fullName: 'Jane Doe', email: 'jane@example.com' },
    });
  });
});
