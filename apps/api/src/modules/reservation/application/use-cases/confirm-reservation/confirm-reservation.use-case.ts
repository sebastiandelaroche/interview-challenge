import { Injectable } from '@nestjs/common';
import { Clock, NotFoundException, UseCase } from '@shared/application';
import { EventRepository, TicketTierId } from '@modules/event/domain';
import {
  Order,
  OrderRepository,
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
    private readonly eventRepository: EventRepository,
    private readonly orderRepository: OrderRepository,
    private readonly clock: Clock,
  ) {}

  async execute(
    input: ConfirmReservationInput,
  ): Promise<ConfirmReservationOutput> {
    const reservationId = ReservationId.from(input.reservationId);

    return this.reservationRepository.withReservationLock(
      reservationId,
      async (locked) => {
        const { reservation } = locked;
        if (!reservation)
          throw new NotFoundException('Reservation', reservationId);

        // Throws if the reservation is expired, cancelled or already confirmed.
        const now = await this.clock.now();
        reservation.confirm(now);

        // The tier exists: the reservation references it through a foreign key.
        const ticketTierId = TicketTierId.from(reservation.ticketTierId);
        const event =
          await this.eventRepository.getByTicketTierId(ticketTierId);
        const tier = event.tiers.find((t) => t.id === ticketTierId)!;

        const order = Order.create({
          eventId: event.id,
          eventName: event.name,
          ticketTierId: reservation.ticketTierId,
          ticketTierName: tier.name,
          ticketsQuantity: reservation.ticketsQuantity,
          ticketUnitPrice: tier.price,
          customerName: reservation.customerFullName,
          customerEmail: reservation.customerEmail,
          reservationId: reservation.id,
          now,
        });

        await locked.save(reservation);
        await this.orderRepository.save(order);

        return toConfirmReservationOutput(order, reservation.status);
      },
    );
  }
}
