import { Clock, NotFoundException } from '@shared/application';
import {
  Event,
  EventDate,
  EventLocation,
  EventName,
  EventRepository,
  TicketTier,
  TicketTierCapacity,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import {
  CustomerEmail,
  CustomerFullName,
  LockedReservation,
  OrderRepository,
  Reservation,
  ReservationExpiredException,
  ReservationRepository,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { ConfirmReservationUseCase } from './confirm-reservation.use-case';

const now = new Date('2026-01-01T10:00:00Z');

const tier = TicketTier.create({
  name: TicketTierName.create('VIP'),
  capacity: TicketTierCapacity.create(10),
  price: TicketTierPrice.create(19.99),
});
const event = Event.create({
  name: EventName.create('Rock Night'),
  date: EventDate.create(new Date(Date.now() + 86_400_000)),
  location: EventLocation.create('Arena'),
  tiers: [tier],
});

const makeReservation = (createdAt = now) =>
  Reservation.create({
    customerFullName: CustomerFullName.create('Jane Doe'),
    customerEmail: CustomerEmail.create('jane@example.com'),
    ticketTierId: TicketTierId.from(tier.id),
    ticketsQuantity: TicketsQuantity.create(3),
    now: createdAt,
  });

const setup = (reservation: Reservation | null) => {
  const saveReservation = jest.fn();
  const orders = { save: jest.fn() };
  const reservations = {
    withReservationLock: (
      _id: string,
      work: (l: LockedReservation) => unknown,
    ) => work({ reservation, save: saveReservation }),
  };
  const events = { getByTicketTierId: jest.fn().mockResolvedValue(event) };
  const useCase = new ConfirmReservationUseCase(
    reservations as unknown as ReservationRepository,
    events as unknown as EventRepository,
    orders as unknown as OrderRepository,
    { now: () => Promise.resolve(now) } as Clock,
  );
  return { useCase, saveReservation, orders };
};

describe('ConfirmReservationUseCase', () => {
  it('confirms the hold and creates an order snapshot', async () => {
    const reservation = makeReservation();
    const { useCase, saveReservation, orders } = setup(reservation);

    const result = await useCase.execute({ reservationId: reservation.id });

    expect(reservation.status).toBe('confirmed');
    expect(saveReservation).toHaveBeenCalledWith(reservation);
    expect(orders.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      reservationId: reservation.id,
      event: { id: event.id, name: 'Rock Night' },
      tier: { id: tier.id, name: 'VIP', unitPrice: 19.99 },
      ticketsQuantity: 3,
      totalPrice: 59.97,
      status: 'confirmed',
    });
  });

  it('throws NotFound when the reservation does not exist', async () => {
    const { useCase, orders } = setup(null);

    await expect(
      useCase.execute({
        reservationId: '22222222-2222-4222-8222-222222222222',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(orders.save).not.toHaveBeenCalled();
  });

  it('creates no order when the hold has expired', async () => {
    const reservation = makeReservation(new Date(now.getTime() - 11 * 60_000));
    const { useCase, saveReservation, orders } = setup(reservation);

    await expect(
      useCase.execute({ reservationId: reservation.id }),
    ).rejects.toThrow(ReservationExpiredException);
    expect(saveReservation).not.toHaveBeenCalled();
    expect(orders.save).not.toHaveBeenCalled();
  });
});
