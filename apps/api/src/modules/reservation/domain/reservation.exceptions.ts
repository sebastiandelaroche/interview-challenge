import { DomainRuleException } from '@shared/domain';

export class ReservationExpiredException extends DomainRuleException {
  constructor() {
    super('Reservation has expired');
    this.name = 'ReservationExpiredException';
  }
}

export class InsufficientTicketsException extends DomainRuleException {
  constructor(
    public readonly requested: number,
    public readonly available: number,
  ) {
    super(
      `Not enough tickets available: requested ${requested}, available ${available}`,
    );
    this.name = 'InsufficientTicketsException';
  }
}
