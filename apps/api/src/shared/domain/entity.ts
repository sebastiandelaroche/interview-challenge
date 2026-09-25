export type EntityId = string | number | bigint;

export abstract class Entity<TId extends EntityId> {
  protected constructor(readonly id: TId) {}

  equals(other?: Entity<TId>): boolean {
    if (!other) return false;
    if (other === this) return true;
    return this.constructor === other.constructor && this.id === other.id;
  }
}
