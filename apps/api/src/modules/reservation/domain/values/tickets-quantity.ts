import { Brand, InvalidValueException } from '@shared/domain';

export type TicketsQuantity = Brand<number, 'TicketsQuantity'>;

export const TicketsQuantity = {
  create: (n: number) => {
    if (!Number.isInteger(n) || n < 1)
      throw new InvalidValueException(
        'TicketsQuantity',
        'must be an integer greater than or equal to 1',
      );
    return n as TicketsQuantity;
  },
};
