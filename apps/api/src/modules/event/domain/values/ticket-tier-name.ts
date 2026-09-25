import { Brand } from '@shared/domain';
import { nonEmpty } from '@shared/utils';

export type TicketTierName = Brand<string, 'TicketTierName'>;

export const TicketTierName = {
  create: (raw: string) => nonEmpty('TicketTierName', raw) as TicketTierName,
};
