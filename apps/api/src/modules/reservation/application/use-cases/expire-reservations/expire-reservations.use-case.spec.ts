import { Clock } from '@shared/application';
import { ReservationRepository } from '@modules/reservation/domain';
import { ExpireReservationsUseCase } from './expire-reservations.use-case';

describe('ExpireReservationsUseCase', () => {
  it('expires the holds that lapsed before now and returns how many', async () => {
    const now = new Date('2026-01-01T10:00:00Z');
    const repository = { expireLapsedHolds: jest.fn().mockResolvedValue(3) };
    const useCase = new ExpireReservationsUseCase(
      repository as unknown as ReservationRepository,
      { now: () => Promise.resolve(now) } as Clock,
    );

    await expect(useCase.execute()).resolves.toBe(3);
    expect(repository.expireLapsedHolds).toHaveBeenCalledWith(now);
  });
});
