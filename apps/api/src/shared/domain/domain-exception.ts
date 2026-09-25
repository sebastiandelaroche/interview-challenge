export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}

export class InvalidValueException extends DomainException {
  constructor(
    public readonly field: string,
    public readonly reason: string,
  ) {
    super(`${field} ${reason}`, 'INVALID_VALUE');
    this.name = 'InvalidValueException';
  }
}

export class DomainRuleException extends DomainException {
  constructor(message: string) {
    super(message, 'DOMAIN_RULE_VIOLATION');
    this.name = 'DomainRuleException';
  }
}
