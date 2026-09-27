import Decimal from 'decimal.js';
import { Brand, InvalidValueException } from '@shared/domain';

export type TicketTierPrice = Brand<number, 'TicketTierPrice'>;

export const TicketTierPrice = {
  create: (n: number) => {
    if (!Number.isFinite(n) || n < 0)
      throw new InvalidValueException(
        'TicketTierPrice',
        'must be a non-negative number',
      );
    if (new Decimal(n).decimalPlaces() > 2)
      throw new InvalidValueException(
        'TicketTierPrice',
        'must have at most 2 decimals',
      );
    return n as TicketTierPrice;
  },
  total: (unitPrice: number, quantity: number): number =>
    new Decimal(unitPrice).times(quantity).toDecimalPlaces(2).toNumber(),
};
