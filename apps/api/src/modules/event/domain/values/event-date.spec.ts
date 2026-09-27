import { InvalidValueException } from '@shared/domain';
import { EventDate } from './event-date';

const future = () => new Date(Date.now() + 86_400_000);

describe('EventDate', () => {
  it('accepts a future Date', () => {
    const date = future();

    expect(EventDate.create(date)).toBe(date);
  });

  it('parses a future ISO string', () => {
    const date = future();

    expect(EventDate.create(date.toISOString())).toEqual(date);
  });

  it('rejects an empty value', () => {
    expect(() => EventDate.create('')).toThrow('must not be empty');
  });

  it('rejects an invalid date', () => {
    expect(() => EventDate.create('not-a-date')).toThrow(
      'must be a valid date',
    );
  });

  it('rejects a past date', () => {
    expect(() => EventDate.create(new Date('2000-01-01'))).toThrow(
      InvalidValueException,
    );
  });
});
