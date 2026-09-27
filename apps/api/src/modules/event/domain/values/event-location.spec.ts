import { InvalidValueException } from '@shared/domain';
import { EventLocation } from './event-location';

describe('EventLocation', () => {
  it('trims the value', () => {
    expect(EventLocation.create('  Arena ')).toBe('Arena');
  });

  it('rejects a blank value', () => {
    expect(() => EventLocation.create('   ')).toThrow(InvalidValueException);
  });
});
