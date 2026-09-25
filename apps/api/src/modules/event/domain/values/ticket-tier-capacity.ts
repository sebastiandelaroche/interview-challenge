import { Brand, InvalidValueException } from '@shared/domain';

export type TicketTierCapacity = Brand<number, 'TicketTierCapacity'>;

export const TicketTierCapacity = {
  create: (n: number) => {
    if (!Number.isInteger(n) || n <= 0)
      throw new InvalidValueException('TicketTierCapacity', 'must be a positive integer');
    return n as TicketTierCapacity;
  },
};
