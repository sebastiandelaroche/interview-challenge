import { InvalidValueException } from '@shared/domain';
import { nonEmpty } from './nonEmpty';

describe('nonEmpty', () => {
  it('returns the trimmed value', () => {
    expect(nonEmpty('Name', '  Jane  ')).toBe('Jane');
  });

  it('rejects a blank value, naming the field', () => {
    expect(() => nonEmpty('Name', '   ')).toThrow(
      new InvalidValueException('Name', 'must not be empty'),
    );
  });

  it('enforces the max length after trimming', () => {
    expect(nonEmpty('Name', ' abc ', 3)).toBe('abc');
    expect(() => nonEmpty('Name', 'abcd', 3)).toThrow(
      'Name must be at most 3 characters',
    );
  });
});
