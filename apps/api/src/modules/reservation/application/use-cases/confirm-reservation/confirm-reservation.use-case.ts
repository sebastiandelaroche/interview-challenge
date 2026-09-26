import { Injectable } from '@nestjs/common';
import { Clock, NotFoundException, UseCase } from '@shared/application';
import {
  ReservationId,
  ReservationRepository,
} from '@modules/reservation/domain';
import {
  ConfirmReservationInput,
  ConfirmReservationOutput,
  toConfirmReservationOutput,
} from './confirm-reservation.dto';

@Injectable()
export class ConfirmReservationUseCase implements UseCase<
  ConfirmReservationInput,
  ConfirmReservationOutput
> {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly clock: Clock,
  ) {}

  async execute(
    input: ConfirmReservationInput,
  ): Promise<ConfirmReservationOutput> {
    const reservationId = ReservationId.from(input.reservationId);

    const reservation =
      await this.reservationRepository.findById(reservationId);
    if (!reservation) throw new NotFoundException('Reservation', reservationId);

    // Throws if the reservation has expired or is already confirmed.
    reservation.confirm(await this.clock.now());
    await this.reservationRepository.save(reservation);

    return toConfirmReservationOutput(reservation);
  }
}
