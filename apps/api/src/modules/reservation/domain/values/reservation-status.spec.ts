import { InvalidValueException } from '@shared/domain';
import { ReservationStatus } from './reservation-status';

describe('ReservationStatus', () => {
  it('defaults to on-hold', () => {
    expect(ReservationStatus.default()).toBe('on-hold');
  });

  it('falls back to the default when empty', () => {
    expect(ReservationStatus.create()).toBe('on-hold');
    expect(ReservationStatus.create('  ')).toBe('on-hold');
  });

  it('normalizes a known status', () => {
    expect(ReservationStatus.create(' CONFIRMED ')).toBe('confirmed');
  });

  it('rejects an unknown status', () => {
    expect(() => ReservationStatus.create('pending')).toThrow(
      InvalidValueException,
    );
  });
});
