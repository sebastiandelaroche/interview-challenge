import { InvalidValueException } from '@shared/domain';
import { TicketTierPrice } from './ticket-tier-price';

describe('TicketTierPrice', () => {
  // 19.99 and 1.13 used to be rejected: 19.99 * 100 === 1998.9999999999998.
  it.each([0, 25, 19.99, 1.13, 0.1, 150.5])('accepts %p', (n) => {
    expect(TicketTierPrice.create(n)).toBe(n);
  });

  it.each([-1, 19.999, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects %p',
    (n) => {
      expect(() => TicketTierPrice.create(n)).toThrow(InvalidValueException);
    },
  );

  describe('total', () => {
    it('multiplies without floating point drift', () => {
      expect(TicketTierPrice.total(19.99, 3)).toBe(59.97);
      expect(TicketTierPrice.total(0.1, 3)).toBe(0.3);
      expect(TicketTierPrice.total(1.13, 7)).toBe(7.91);
    });
  });
});
