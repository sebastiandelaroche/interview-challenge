import { InvalidValueException } from '@shared/domain';
import { EventName } from './event-name';

describe('EventName', () => {
  it('trims the value', () => {
    expect(EventName.create('  Rock Night ')).toBe('Rock Night');
  });

  it('rejects a blank value', () => {
    expect(() => EventName.create('   ')).toThrow(InvalidValueException);
  });
});
