import { Brand, InvalidValueException } from '@shared/domain';

export const RESERVATION_STATUSES = [
  'on-hold',
  'confirmed',
  'expired',
  'cancelled',
] as const;

export type ReservationStatusValue = (typeof RESERVATION_STATUSES)[number];

export type ReservationStatus = Brand<
  ReservationStatusValue,
  'ReservationStatus'
>;

export const ReservationStatus = {
  default: () => 'on-hold' as ReservationStatus,
  create: (raw?: string) => {
    if (raw === undefined || raw === null || raw.trim() === '')
      return ReservationStatus.default();
    const status = raw.trim().toLowerCase();
    if (!(RESERVATION_STATUSES as readonly string[]).includes(status))
      throw new InvalidValueException(
        'ReservationStatus',
        `must be one of: ${RESERVATION_STATUSES.join(', ')}`,
      );
    return status as ReservationStatus;
  },
};
