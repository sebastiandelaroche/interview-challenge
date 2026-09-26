import {
  CustomerEmail,
  CustomerFullName,
  Reservation,
  ReservationId,
  ReservationStatus,
  ReservationStatusValue,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { $Enums, Prisma } from '@shared/infrastructure/database';

type PrismaReservationStatus = $Enums.ReservationStatus;

// Keyed by exact status unions so a missing or misspelled status fails to compile.
const TO_PRISMA_STATUS: Record<
  ReservationStatusValue,
  PrismaReservationStatus
> = {
  'on-hold': 'ON_HOLD',
  confirmed: 'CONFIRMED',
  expired: 'EXPIRED',
  cancelled: 'CANCELLED',
};

const TO_DOMAIN_STATUS: Record<
  PrismaReservationStatus,
  ReservationStatusValue
> = {
  ON_HOLD: 'on-hold',
  CONFIRMED: 'confirmed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};

type PrismaReservation = Prisma.ReservationGetPayload<object>;

// Persisted data is trusted: cast to branded types instead of re-running creation rules.
export const ReservationMapper = {
  toDomain(row: PrismaReservation): Reservation {
    return Reservation.hydrate({
      id: row.id as ReservationId,
      customerFullName: row.customerFullName as CustomerFullName,
      customerEmail: row.customerEmail as CustomerEmail,
      ticketTierId: row.ticketTierId as TicketTierId,
      ticketsQuantity: row.ticketsQuantity as TicketsQuantity,
      status: TO_DOMAIN_STATUS[row.status] as ReservationStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  toStatus(status: ReservationStatusValue): PrismaReservationStatus {
    return TO_PRISMA_STATUS[status];
  },

  toPersistence(
    reservation: Reservation,
  ): Prisma.ReservationUncheckedCreateInput {
    return {
      id: reservation.id,
      ticketTierId: reservation.ticketTierId,
      customerFullName: reservation.customerFullName,
      customerEmail: reservation.customerEmail,
      ticketsQuantity: reservation.ticketsQuantity,
      status: ReservationMapper.toStatus(reservation.status),
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  },
};
