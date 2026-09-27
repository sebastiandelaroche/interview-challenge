import { AggregateRoot } from './aggregate-root';

class Cart extends AggregateRoot<string> {
  constructor() {
    super('cart-1');
  }

  checkout(at: Date) {
    this.record({ type: 'CheckedOut', occurredAt: at });
  }
}

describe('AggregateRoot', () => {
  it('collects recorded events and clears them when pulled', () => {
    const cart = new Cart();
    const at = new Date('2026-01-01T10:00:00Z');

    cart.checkout(at);

    expect(cart.pullEvents()).toEqual([{ type: 'CheckedOut', occurredAt: at }]);
    expect(cart.pullEvents()).toEqual([]);
  });
});
