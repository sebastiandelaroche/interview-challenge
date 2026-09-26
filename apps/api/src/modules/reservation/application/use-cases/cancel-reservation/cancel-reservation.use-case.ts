import { Injectable } from '@nestjs/common';
import { Clock, NotFoundException, UseCase } from '@shared/application';
import {
  ReservationId,
  ReservationRepository,
} from '@modules/reservation/domain';
import { CancelReservationInput } from './cancel-reservation.dto';

@Injectable()
export class CancelReservationUseCase implements UseCase<CancelReservationInput> {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly clock: Clock,
  ) {}

  async execute(input: CancelReservationInput): Promise<void> {
    const reservationId = ReservationId.from(input.reservationId);

    const reservation =
      await this.reservationRepository.findById(reservationId);
    if (!reservation) throw new NotFoundException('Reservation', reservationId);

    // Throws if the reservation is confirmed, expired or already cancelled.
    reservation.cancel(await this.clock.now());
    await this.reservationRepository.save(reservation);
  }
}
