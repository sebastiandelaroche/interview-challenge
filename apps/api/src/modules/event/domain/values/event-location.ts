import { Brand } from '@shared/domain';
import { nonEmpty } from '@shared/utils';

export type EventLocation = Brand<string, 'EventLocation'>;

export const EventLocation = {
  create: (raw: string) => nonEmpty('EventLocation', raw) as EventLocation,
};
