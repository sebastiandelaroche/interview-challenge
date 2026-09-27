import { InvalidValueException } from '@shared/domain';
import { ReservationId } from './reservation-id';

const UUID_REGEX = /^[0-9a-f-]{36}$/;

describe('ReservationId', () => {
  it('generates a unique UUID', () => {
    const id = ReservationId.generate();

    expect(id).toMatch(UUID_REGEX);
    expect(ReservationId.generate()).not.toBe(id);
  });

  it('accepts an existing UUID and lowercases it', () => {
    expect(ReservationId.from('11111111-AAAA-4111-8111-111111111111')).toBe(
      '11111111-aaaa-4111-8111-111111111111',
    );
  });

  it('rejects a value that is not a UUID', () => {
    expect(() => ReservationId.from('abc')).toThrow(InvalidValueException);
  });
});
