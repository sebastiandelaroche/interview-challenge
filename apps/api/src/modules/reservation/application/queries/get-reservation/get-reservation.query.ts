import { Injectable } from '@nestjs/common';
import { Clock, NotFoundException, Query } from '@shared/application';
import { ReservationReadModel, ReservationView } from '../../read-models';

export type GetReservationInput = { id: string };

@Injectable()
export class GetReservationQuery implements Query<
  GetReservationInput,
  ReservationView
> {
  constructor(
    private readonly readModel: ReservationReadModel,
    private readonly clock: Clock,
  ) {}

  async execute(input: GetReservationInput): Promise<ReservationView> {
    const reservation = await this.readModel.findById(
      input.id,
      await this.clock.now(),
    );
    if (!reservation) throw new NotFoundException('Reservation', input.id);
    return reservation;
  }
}
