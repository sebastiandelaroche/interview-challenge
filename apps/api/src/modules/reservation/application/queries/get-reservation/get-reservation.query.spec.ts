import { Clock, NotFoundException } from '@shared/application';
import { ReservationReadModel, ReservationView } from '../../read-models';
import { GetReservationQuery } from './get-reservation.query';

const now = new Date('2026-01-01T10:00:00Z');

const setup = (found: ReservationView | null) => {
  const readModel = { findById: jest.fn().mockResolvedValue(found) };
  const clock = { now: () => Promise.resolve(now) };
  const query = new GetReservationQuery(
    readModel as unknown as ReservationReadModel,
    clock as Clock,
  );
  return { query, readModel };
};

describe('GetReservationQuery', () => {
  it('returns the reservation, with its status evaluated at the current time', async () => {
    const reservation = { id: 'r1' } as ReservationView;
    const { query, readModel } = setup(reservation);

    await expect(query.execute({ id: 'r1' })).resolves.toBe(reservation);
    expect(readModel.findById).toHaveBeenCalledWith('r1', now);
  });

  it('throws NotFound when the reservation does not exist', async () => {
    const { query } = setup(null);

    await expect(query.execute({ id: 'r1' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
