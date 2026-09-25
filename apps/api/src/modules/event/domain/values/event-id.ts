import { Brand } from '@shared/domain';
import { uuid } from '@shared/utils';

export type EventId = Brand<string, 'EventId'>;

export const EventId = {
  generate: () => crypto.randomUUID() as EventId,
  from: (raw: string) => uuid('EventId', raw) as EventId,
};
