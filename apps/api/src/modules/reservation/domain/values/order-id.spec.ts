import { InvalidValueException } from '@shared/domain';
import { OrderId } from './order-id';

describe('OrderId', () => {
  it('generates a 24-char hex ObjectId', () => {
    expect(OrderId.generate()).toMatch(/^[0-9a-f]{24}$/);
  });

  it('accepts an existing ObjectId and lowercases it', () => {
    expect(OrderId.from('65F0C0FFEE0000000000ABCD')).toBe(
      '65f0c0ffee0000000000abcd',
    );
  });

  it.each(['abc', 'z'.repeat(24), 'abcdefghijkl'])('rejects %p', (raw) => {
    expect(() => OrderId.from(raw)).toThrow(InvalidValueException);
  });
});
