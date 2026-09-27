import { InvalidValueException } from '@shared/domain';
import { EventId } from './event-id';

describe('EventId', () => {
  it('generates a unique UUID', () => {
    const id = EventId.generate();

    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(EventId.generate()).not.toBe(id);
  });

  it('accepts an existing UUID', () => {
    const raw = '11111111-1111-4111-8111-111111111111';

    expect(EventId.from(raw)).toBe(raw);
  });

  it('rejects a value that is not a UUID', () => {
    expect(() => EventId.from('event-1')).toThrow(InvalidValueException);
  });
});
