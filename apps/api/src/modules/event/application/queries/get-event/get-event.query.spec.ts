import { Clock, NotFoundException } from '@shared/application';
import { EventReadModel, EventView } from '../../read-models';
import { GetEventQuery } from './get-event.query';

const now = new Date('2026-01-01T10:00:00Z');

const setup = (found: EventView | null) => {
  const readModel = { findById: jest.fn().mockResolvedValue(found) };
  const clock = { now: () => Promise.resolve(now) };
  const query = new GetEventQuery(
    readModel as unknown as EventReadModel,
    clock as Clock,
  );
  return { query, readModel };
};

describe('GetEventQuery', () => {
  it('returns the event, with availability computed at the current time', async () => {
    const event = { id: 'e1' } as EventView;
    const { query, readModel } = setup(event);

    await expect(query.execute({ id: 'e1' })).resolves.toBe(event);
    expect(readModel.findById).toHaveBeenCalledWith('e1', now);
  });

  it('throws NotFound when the event does not exist', async () => {
    const { query } = setup(null);

    await expect(query.execute({ id: 'e1' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
