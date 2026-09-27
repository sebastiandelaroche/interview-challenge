import {
  DomainException,
  DomainRuleException,
  InvalidValueException,
} from './domain-exception';

describe('Domain exceptions', () => {
  it('DomainException carries a message and an optional code', () => {
    const error = new DomainException('boom', 'CODE');

    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      name: 'DomainException',
      message: 'boom',
      code: 'CODE',
    });
  });

  it('InvalidValueException names the field and reason', () => {
    const error = new InvalidValueException('Email', 'is invalid');

    expect(error).toBeInstanceOf(DomainException);
    expect(error).toMatchObject({
      name: 'InvalidValueException',
      message: 'Email is invalid',
      field: 'Email',
      reason: 'is invalid',
      code: 'INVALID_VALUE',
    });
  });

  it('DomainRuleException marks a broken business rule', () => {
    const error = new DomainRuleException('Not allowed');

    expect(error).toBeInstanceOf(DomainException);
    expect(error).toMatchObject({
      name: 'DomainRuleException',
      code: 'DOMAIN_RULE_VIOLATION',
    });
  });
});
