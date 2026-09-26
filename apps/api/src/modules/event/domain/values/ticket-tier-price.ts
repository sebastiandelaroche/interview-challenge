import { Brand, InvalidValueException } from '@shared/domain';

export type TicketTierPrice = Brand<number, 'TicketTierPrice'>;

export const TicketTierPrice = {
  create: (n: number) => {
    if (!Number.isFinite(n) || n < 0)
      throw new InvalidValueException(
        'TicketTierPrice',
        'must be a non-negative number',
      );
    if (Math.round(n * 100) !== n * 100)
      throw new InvalidValueException(
        'TicketTierPrice',
        'must have at most 2 decimals',
      );
    return n as TicketTierPrice;
  },
};
