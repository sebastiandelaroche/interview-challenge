import { Brand, InvalidValueException } from '@shared/domain';

export type EventDate = Brand<Date, 'EventDate'>;

export const EventDate = {
  create: (raw: Date | string) => {
    if (raw === null || raw === undefined || raw === '')
      throw new InvalidValueException('EventDate', 'must not be empty');
    const date = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(date.getTime()))
      throw new InvalidValueException('EventDate', 'must be a valid date');
    if (date.getTime() <= Date.now())
      throw new InvalidValueException('EventDate', 'must be in the future');
    return date as EventDate;
  },
};
