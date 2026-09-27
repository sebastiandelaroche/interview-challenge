import { InvalidValueException } from '@shared/domain';
import { TicketTierName } from './ticket-tier-name';

describe('TicketTierName', () => {
  it('trims the value', () => {
    expect(TicketTierName.create('  VIP ')).toBe('VIP');
  });

  it('rejects a blank value', () => {
    expect(() => TicketTierName.create('   ')).toThrow(InvalidValueException);
  });
});
