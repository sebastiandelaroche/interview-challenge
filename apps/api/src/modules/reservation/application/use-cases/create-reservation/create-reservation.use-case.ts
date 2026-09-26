import { Injectable } from '@nestjs/common';
import { Clock, NotFoundException, UseCase } from '@shared/application';
import { EventId, EventRepository } from '@modules/event/domain';
import {
  CustomerEmail,
  CustomerFullName,
  Reservation,
  ReservationRepository,
  ReservationService,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import {
  CreateReservationInput,
  CreateReservationOutput,
  toCreateReservationOutput,
} from './create-reservation.dto';

@Injectable()
export class CreateReservationUseCase implements UseCase<
  CreateReservationInput,
  CreateReservationOutput
> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly clock: Clock,
  ) {}

  async execute(
    input: CreateReservationInput,
  ): Promise<CreateReservationOutput> {
    const eventId = EventId.from(input.eventId);
    const ticketTierId = TicketTierId.from(input.ticketTierId);
    const ticketsQuantity = TicketsQuantity.create(input.ticketsQuantity);
    const customerFullName = CustomerFullName.create(input.customerFullName);
    const customerEmail = CustomerEmail.create(input.customerEmail);

    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new NotFoundException('Event', eventId);

    const tier = event.tiers.find((t) => t.id === ticketTierId);
    if (!tier) throw new NotFoundException('TicketTier', ticketTierId);

    const reservation = await this.reservationRepository.withTicketTierLock(
      ticketTierId,
      async (locked) => {
        const now = await this.clock.now();

        const taken = await locked.sumTakenTickets(now);
        ReservationService.checkTicketAvailability(
          tier.capacity,
          taken,
          ticketsQuantity,
        );

        const reservation = Reservation.create({
          ticketTierId,
          ticketsQuantity,
          customerFullName,
          customerEmail,
          now,
        });
        await locked.save(reservation);

        return reservation;
      },
    );

    return toCreateReservationOutput(event, tier, reservation);
  }
}
