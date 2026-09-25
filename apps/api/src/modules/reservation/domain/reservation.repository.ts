import { Reservation } from './reservation';

export abstract class ReservationRepository {
  abstract save(reservation: Reservation): Promise<void>;
}
