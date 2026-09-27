import { InvalidValueException } from '@shared/domain';
import { uuid } from './uuid';

describe('uuid', () => {
  it('returns a trimmed, lowercased UUID', () => {
    expect(uuid('Id', ' 11111111-AAAA-4111-8111-111111111111 ')).toBe(
      '11111111-aaaa-4111-8111-111111111111',
    );
  });

  it.each(['', 'abc', '11111111-1111-4111-8111-11111111111z'])(
    'rejects %p',
    (raw) => {
      expect(() => uuid('Id', raw)).toThrow(InvalidValueException);
    },
  );
});
