import { InvalidValueException } from '@shared/domain';
import { TicketTierId } from './ticket-tier-id';

describe('TicketTierId (reservation)', () => {
  it('accepts a UUID', () => {
    const raw = '11111111-1111-4111-8111-111111111111';

    expect(TicketTierId.from(raw)).toBe(raw);
  });

  it('rejects a value that is not a UUID', () => {
    expect(() => TicketTierId.from('tier-1')).toThrow(InvalidValueException);
  });
});
