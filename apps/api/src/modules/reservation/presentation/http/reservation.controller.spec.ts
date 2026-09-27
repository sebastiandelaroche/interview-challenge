import {
  CancelReservationUseCase,
  ConfirmReservationUseCase,
  CreateReservationUseCase,
} from '../../application/use-cases';
import { GetReservationQuery } from '../../application/queries';
import { CreateReservationRequest } from './dto/create-reservation.request';
import { ReservationController } from './reservation.controller';

describe('ReservationController', () => {
  const reservation = { id: 'r1' };
  const order = { id: 'o1' };
  const create = { execute: jest.fn().mockResolvedValue(reservation) };
  const confirm = { execute: jest.fn().mockResolvedValue(order) };
  const cancel = { execute: jest.fn().mockResolvedValue(undefined) };
  const get = { execute: jest.fn().mockResolvedValue(reservation) };
  const controller = new ReservationController(
    create as unknown as CreateReservationUseCase,
    confirm as unknown as ConfirmReservationUseCase,
    cancel as unknown as CancelReservationUseCase,
    get as unknown as GetReservationQuery,
  );

  it('GET /reservations/:id returns the reservation', async () => {
    await expect(controller.findOne('r1')).resolves.toBe(reservation);
    expect(get.execute).toHaveBeenCalledWith({ id: 'r1' });
  });

  it('POST /reservations creates a hold from the request body', async () => {
    const body = { ticketsQuantity: 2 } as CreateReservationRequest;

    await expect(controller.create(body)).resolves.toBe(reservation);
    expect(create.execute).toHaveBeenCalledWith(body);
  });

  it('POST /reservations/:id/confirm returns the created order', async () => {
    await expect(controller.confirm('r1')).resolves.toBe(order);
    expect(confirm.execute).toHaveBeenCalledWith({ reservationId: 'r1' });
  });

  it('DELETE /reservations/:id cancels and returns a confirmation message', async () => {
    await expect(controller.cancel('r1')).resolves.toEqual({
      message: 'Reservation cancelled successfully',
    });
    expect(cancel.execute).toHaveBeenCalledWith({ reservationId: 'r1' });
  });
});
