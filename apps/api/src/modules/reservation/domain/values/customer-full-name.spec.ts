import { InvalidValueException } from '@shared/domain';
import { CustomerFullName } from './customer-full-name';

describe('CustomerFullName', () => {
  it('trims the name', () => {
    expect(CustomerFullName.create('  Jane Doe ')).toBe('Jane Doe');
  });

  it('rejects a blank name', () => {
    expect(() => CustomerFullName.create('   ')).toThrow(InvalidValueException);
  });
});
