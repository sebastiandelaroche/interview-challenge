import { ReservationView } from './reservation.view';

export abstract class ReservationReadModel {
  abstract findById(id: string, now: Date): Promise<ReservationView | null>;
}
