import { Reservation } from './reservation';
import { ReservationId, TicketTierId } from './values';

// Operations available while holding a ticket tier lock; all run in the lock's transaction.
export interface LockedTierReservations {
  // Sum of tickets held by confirmed and still-active (expires_at after now) on-hold reservations.
  sumTakenTickets(now: Date): Promise<number>;
  save(reservation: Reservation): Promise<void>;
}

// A reservation read under a row lock; save runs in the lock's transaction.
export interface LockedReservation {
  reservation: Reservation | null;
  save(reservation: Reservation): Promise<void>;
}

export abstract class ReservationRepository {
  abstract findById(id: ReservationId): Promise<Reservation | null>;

  // Serializes concurrent reservations for the same tier until work completes.
  abstract withTicketTierLock<T>(
    ticketTierId: TicketTierId,
    work: (locked: LockedTierReservations) => Promise<T>,
  ): Promise<T>;

  // Serializes concurrent changes to the same reservation; if work throws, the transaction rolls back.
  abstract withReservationLock<T>(
    id: ReservationId,
    work: (locked: LockedReservation) => Promise<T>,
  ): Promise<T>;

  // Persists 'expired' on holds whose window has lapsed; returns how many were updated.
  abstract expireLapsedHolds(now: Date): Promise<number>;
}
