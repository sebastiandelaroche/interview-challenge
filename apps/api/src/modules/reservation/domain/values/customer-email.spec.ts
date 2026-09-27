import { InvalidValueException } from '@shared/domain';
import { CustomerEmail } from './customer-email';

describe('CustomerEmail', () => {
  it('trims and lowercases the email', () => {
    expect(CustomerEmail.create('  Jane@Example.COM ')).toBe(
      'jane@example.com',
    );
  });

  it.each(['', 'jane', 'jane@example', 'jane @example.com'])(
    'rejects %p',
    (raw) => {
      expect(() => CustomerEmail.create(raw)).toThrow(InvalidValueException);
    },
  );

  it('rejects an email longer than 254 characters', () => {
    const raw = `${'a'.repeat(250)}@example.com`;

    expect(() => CustomerEmail.create(raw)).toThrow('at most 254 characters');
  });
});
