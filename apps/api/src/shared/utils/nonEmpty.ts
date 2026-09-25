import { InvalidValueException } from '@shared/domain';

export const nonEmpty = (field: string, raw: string, max?: number): string => {
  const v = raw.trim();
  if (!v) throw new InvalidValueException(field, 'must not be empty');
  if (max !== undefined && v.length > max)
    throw new InvalidValueException(field, `must be at most ${max} characters`);
  return v;
};
