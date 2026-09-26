import { Reservation } from './reservation';
import { ReservationId, TicketTierId } from './values';

// Operations available while holding a ticket tier lock; all run in the lock's transaction.
export interface LockedTierReservations {
  // Sum of tickets held by confirmed and still-active (within HOLD_MINUTES of now) on-hold reservations.
  sumTakenTickets(now: Date): Promise<number>;
  save(reservation: Reservation): Promise<void>;
}

export abstract class ReservationRepository {
  abstract findById(id: ReservationId): Promise<Reservation | null>;
  abstract save(reservation: Reservation): Promise<void>;
  // Serializes concurrent reservations for the same tier until work completes.
  abstract withTicketTierLock<T>(
    ticketTierId: TicketTierId,
    work: (locked: LockedTierReservations) => Promise<T>,
  ): Promise<T>;
}
