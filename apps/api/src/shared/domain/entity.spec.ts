import { Entity } from './entity';

class User extends Entity<string> {
  constructor(id: string) {
    super(id);
  }
}

class Admin extends Entity<string> {
  constructor(id: string) {
    super(id);
  }
}

describe('Entity', () => {
  it('is equal to another entity of the same type and id', () => {
    expect(new User('1').equals(new User('1'))).toBe(true);
  });

  it('is not equal when the id differs', () => {
    expect(new User('1').equals(new User('2'))).toBe(false);
  });

  it('is not equal to a different type with the same id', () => {
    expect(new User('1').equals(new Admin('1'))).toBe(false);
  });

  it('is equal to itself', () => {
    const user = new User('1');

    expect(user.equals(user)).toBe(true);
  });

  it('is not equal to nothing', () => {
    expect(new User('1').equals(undefined)).toBe(false);
  });
});
