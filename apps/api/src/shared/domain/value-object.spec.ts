import { ValueObject } from './value-object';

class Money extends ValueObject<{ amount: number; currency: string }> {
  constructor(amount: number, currency: string) {
    super({ amount, currency });
  }
}

class Label extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}

class Tag extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}

class Period extends ValueObject<{ from: Date; tags: Tag[] }> {
  constructor(from: Date, tags: Tag[]) {
    super({ from, tags });
  }
}

describe('ValueObject', () => {
  it('compares by value, not by reference', () => {
    expect(new Money(10, 'USD').equals(new Money(10, 'USD'))).toBe(true);
    expect(new Money(10, 'USD').equals(new Money(10, 'EUR'))).toBe(false);
  });

  it('is equal to itself and not to nothing', () => {
    const money = new Money(10, 'USD');

    expect(money.equals(money)).toBe(true);
    expect(money.equals(undefined)).toBe(false);
  });

  it('is not equal to another type holding the same value', () => {
    expect(new Label('a').equals(new Tag('a'))).toBe(false);
  });

  it('compares nested dates and value objects', () => {
    const from = new Date('2026-01-01');

    expect(
      new Period(from, [new Tag('a')]).equals(
        new Period(new Date(from), [new Tag('a')]),
      ),
    ).toBe(true);
    expect(
      new Period(from, [new Tag('a')]).equals(new Period(from, [new Tag('b')])),
    ).toBe(false);
  });

  it('treats objects with different keys or shapes as different', () => {
    const from = new Date('2026-01-01');

    expect(
      new Period(from, [new Tag('a')]).equals(
        new Period(from, [new Tag('a'), new Tag('b')]),
      ),
    ).toBe(false);
    expect(
      new Period(from, [new Tag('a')]).equals(
        new Period(from, { 0: new Tag('a') } as unknown as Tag[]),
      ),
    ).toBe(false);
    expect(
      new Period(from, [new Tag('a')]).equals(
        new Period(from, null as unknown as Tag[]),
      ),
    ).toBe(false);
  });

  it('is immutable', () => {
    const money = new Money(10, 'USD');

    expect(Object.isFrozen(money.value)).toBe(true);
  });

  it('serializes to its value', () => {
    expect(new Label('vip').toString()).toBe('vip');
    expect(new Money(10, 'USD').toString()).toBe(
      '{"amount":10,"currency":"USD"}',
    );
    expect(JSON.stringify({ price: new Money(10, 'USD') })).toBe(
      '{"price":{"amount":10,"currency":"USD"}}',
    );
  });
});
