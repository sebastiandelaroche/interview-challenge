import { Brand } from '@shared/domain';
import { nonEmpty } from '@shared/utils';

export type EventName = Brand<string, 'EventName'>;

export const EventName = {
  create: (raw: string) => nonEmpty('EventName', raw) as EventName,
};
