import { Brand, InvalidValueException } from '@shared/domain';
import { nonEmpty } from '@shared/utils';

export type CustomerEmail = Brand<string, 'CustomerEmail'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CustomerEmail = {
  create: (raw: string) => {
    const email = nonEmpty('CustomerEmail', raw, 254).toLowerCase();
    if (!EMAIL_REGEX.test(email))
      throw new InvalidValueException('CustomerEmail', 'must be a valid email address');
    return email as CustomerEmail;
  },
};
