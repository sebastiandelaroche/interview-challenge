import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpireReservationsUseCase } from '@modules/reservation/application/use-cases';

@Injectable()
export class ExpireReservationsCron {
  private readonly logger = new Logger(ExpireReservationsCron.name);

  constructor(private readonly expireReservations: ExpireReservationsUseCase) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'expire-reservations' })
  async handle(): Promise<void> {
    try {
      const expired = await this.expireReservations.execute();
      if (expired > 0) this.logger.log(`Expired ${expired} reservation(s)`);
    } catch (error) {
      this.logger.error('Failed to expire reservations', error);
    }
  }
}
