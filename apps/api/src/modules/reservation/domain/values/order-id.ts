import { ObjectId } from 'mongodb';
import { Brand, InvalidValueException } from '@shared/domain';

// Orders live in MongoDB, so their id is an ObjectId in its 24-char hex form.
export type OrderId = Brand<string, 'OrderId'>;

export const OrderId = {
  generate: () => new ObjectId().toHexString() as OrderId,
  from: (raw: string) => {
    if (!ObjectId.isValid(raw) || raw.length !== 24)
      throw new InvalidValueException('OrderId', 'must be a valid ObjectId');
    return raw.toLowerCase() as OrderId;
  },
};
