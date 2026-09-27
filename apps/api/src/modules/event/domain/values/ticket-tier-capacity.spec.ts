import { InvalidValueException } from '@shared/domain';
import { TicketTierCapacity } from './ticket-tier-capacity';

describe('TicketTierCapacity', () => {
  it('accepts a positive integer', () => {
    expect(TicketTierCapacity.create(100)).toBe(100);
  });

  it.each([0, -5, 2.5])('rejects %p', (n) => {
    expect(() => TicketTierCapacity.create(n)).toThrow(InvalidValueException);
  });
});
