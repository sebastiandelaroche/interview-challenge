import { Brand } from '@shared/domain';
import { nonEmpty } from '@shared/utils';

export type CustomerFullName = Brand<string, 'CustomerFullName'>;

export const CustomerFullName = {
  create: (raw: string) => nonEmpty('CustomerFullName', raw) as CustomerFullName,
};
