import { InvalidValueException } from '@shared/domain';
import { nonEmpty } from './nonEmpty';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const uuid = (field: string, raw: string): string => {
  const v = nonEmpty(field, raw).toLowerCase();
  if (!UUID_REGEX.test(v))
    throw new InvalidValueException(field, 'must be a valid UUID');
  return v;
};
