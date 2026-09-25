import { Brand } from '@shared/domain';
import { uuid } from '@shared/utils';

export type TicketTierId = Brand<string, 'TicketTierId'>;

export const TicketTierId = {
  from: (raw: string) => uuid('TicketTierId', raw) as TicketTierId,
};
