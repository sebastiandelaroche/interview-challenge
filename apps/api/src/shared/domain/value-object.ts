export abstract class ValueObject<T> {
  public readonly value: Readonly<T>;

  protected constructor(value: T) {
    this.value = Object.freeze(
      typeof value === 'object' && value !== null ? { ...value } : value,
    ) as Readonly<T>;
  }

  equals(other?: ValueObject<T>): boolean {
    if (!other) return false;
    if (other === this) return true;
    if (other.constructor !== this.constructor) return false;
    return deepEqual(this.value, other.value);
  }

  toJSON(): T {
    return this.value as T;
  }

  toString(): string {
    return typeof this.value === 'object'
      ? JSON.stringify(this.toJSON(), bigintReplacer)
      : String(this.value);
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a instanceof ValueObject && b instanceof ValueObject) return a.equals(b);
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const ka = Object.keys(a),
    kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual((a as any)[k], (b as any)[k]));
}

const bigintReplacer = (_: string, v: unknown) =>
  typeof v === 'bigint' ? v.toString() : v;
