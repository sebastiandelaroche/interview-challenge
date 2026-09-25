import { Brand } from '@shared/domain';
import { uuid } from '@shared/utils';

export type ReservationId = Brand<string, 'ReservationId'>;

export const ReservationId = {
  generate: () => crypto.randomUUID() as ReservationId,
  from: (raw: string) => uuid('ReservationId', raw) as ReservationId,
};
