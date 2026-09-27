import { Injectable } from '@nestjs/common';
import { Clock, UseCase } from '@shared/application';
import { ReservationRepository } from '@modules/reservation/domain';

@Injectable()
export class ExpireReservationsUseCase implements UseCase<void, number> {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly clock: Clock,
  ) {}

  async execute(): Promise<number> {
    return this.reservationRepository.expireLapsedHolds(await this.clock.now());
  }
}
