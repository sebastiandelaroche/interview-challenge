import { TicketTier } from './ticket-tier';
import {
  TicketTierCapacity,
  TicketTierId,
  TicketTierName,
  TicketTierPrice,
} from './values';

const props = {
  name: TicketTierName.create('VIP'),
  capacity: TicketTierCapacity.create(50),
  price: TicketTierPrice.create(150),
};

describe('TicketTier', () => {
  it('creates a tier with a new id', () => {
    const tier = TicketTier.create(props);

    expect(tier.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(tier).toMatchObject(props);
  });

  it('hydrates a stored tier as-is', () => {
    const at = new Date('2026-01-01T10:00:00Z');
    const id = TicketTierId.from('11111111-1111-4111-8111-111111111111');

    const tier = TicketTier.hydrate({
      ...props,
      id,
      createdAt: at,
      updatedAt: at,
    });

    expect(tier).toMatchObject({ id, createdAt: at, updatedAt: at });
  });
});
