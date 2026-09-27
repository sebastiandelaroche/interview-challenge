import { Clock, NotFoundException } from '@shared/application';
import {
  CustomerEmail,
  CustomerFullName,
  LockedReservation,
  Reservation,
  ReservationAlreadyConfirmedException,
  ReservationRepository,
  TicketsQuantity,
  TicketTierId,
} from '@modules/reservation/domain';
import { CancelReservationUseCase } from './cancel-reservation.use-case';

const now = new Date('2026-01-01T10:00:00Z');

const makeReservation = () =>
  Reservation.create({
    customerFullName: CustomerFullName.create('Jane Doe'),
    customerEmail: CustomerEmail.create('jane@example.com'),
    ticketTierId: TicketTierId.from('11111111-1111-4111-8111-111111111111'),
    ticketsQuantity: TicketsQuantity.create(2),
    now,
  });

// Runs the work callback with the given reservation, recording saves.
const setup = (reservation: Reservation | null) => {
  const save = jest.fn();
  const repository = {
    withReservationLock: (
      _id: string,
      work: (l: LockedReservation) => unknown,
    ) => work({ reservation, save }),
  };
  const useCase = new CancelReservationUseCase(
    repository as unknown as ReservationRepository,
    { now: () => Promise.resolve(now) } as Clock,
  );
  return { useCase, save };
};

describe('CancelReservationUseCase', () => {
  it('cancels an active hold and saves it', async () => {
    const reservation = makeReservation();
    const { useCase, save } = setup(reservation);

    await useCase.execute({ reservationId: reservation.id });

    expect(reservation.status).toBe('cancelled');
    expect(save).toHaveBeenCalledWith(reservation);
  });

  it('throws NotFound when the reservation does not exist', async () => {
    const { useCase, save } = setup(null);

    await expect(
      useCase.execute({
        reservationId: '22222222-2222-4222-8222-222222222222',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(save).not.toHaveBeenCalled();
  });

  it('does not save when the domain refuses the cancellation', async () => {
    const reservation = makeReservation();
    reservation.confirm(now);
    const { useCase, save } = setup(reservation);

    await expect(
      useCase.execute({ reservationId: reservation.id }),
    ).rejects.toThrow(ReservationAlreadyConfirmedException);
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects a malformed id before touching the repository', async () => {
    const { useCase } = setup(null);

    await expect(useCase.execute({ reservationId: 'abc' })).rejects.toThrow(
      'ReservationId must be a valid UUID',
    );
  });
});
