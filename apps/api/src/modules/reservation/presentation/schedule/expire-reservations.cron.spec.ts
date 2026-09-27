import { Logger } from '@nestjs/common';
import { ExpireReservationsUseCase } from '@modules/reservation/application/use-cases';
import { ExpireReservationsCron } from './expire-reservations.cron';

const setup = (execute: jest.Mock) =>
  new ExpireReservationsCron({
    execute,
  } as unknown as ExpireReservationsUseCase);

describe('ExpireReservationsCron', () => {
  afterEach(() => jest.restoreAllMocks());

  it('runs the expiry and logs how many holds expired', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    await setup(jest.fn().mockResolvedValue(2)).handle();

    expect(log).toHaveBeenCalledWith('Expired 2 reservation(s)');
  });

  it('stays quiet when nothing expired', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    await setup(jest.fn().mockResolvedValue(0)).handle();

    expect(log).not.toHaveBeenCalled();
  });

  it('logs and swallows failures so the schedule keeps running', async () => {
    const error = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const failure = new Error('db down');

    await expect(
      setup(jest.fn().mockRejectedValue(failure)).handle(),
    ).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledWith(
      'Failed to expire reservations',
      failure,
    );
  });
});
