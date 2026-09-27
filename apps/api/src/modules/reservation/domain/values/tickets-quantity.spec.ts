import { InvalidValueException } from '@shared/domain';
import { TicketsQuantity } from './tickets-quantity';

describe('TicketsQuantity', () => {
  it('accepts a positive integer', () => {
    expect(TicketsQuantity.create(3)).toBe(3);
  });

  it.each([0, -1, 1.5, Number.NaN])('rejects %p', (n) => {
    expect(() => TicketsQuantity.create(n)).toThrow(InvalidValueException);
  });
});
