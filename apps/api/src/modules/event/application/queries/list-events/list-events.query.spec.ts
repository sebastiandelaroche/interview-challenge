import { Clock } from '@shared/application';
import { EventReadModel, EventView } from '../../read-models';
import { ListEventsQuery } from './list-events.query';

const now = new Date('2026-01-01T10:00:00Z');

describe('ListEventsQuery', () => {
  it('returns every event, with availability computed at the current time', async () => {
    const events = [{ id: 'e1' } as EventView];
    const readModel = { findAll: jest.fn().mockResolvedValue(events) };
    const clock = { now: () => Promise.resolve(now) };
    const query = new ListEventsQuery(
      readModel as unknown as EventReadModel,
      clock as Clock,
    );

    await expect(query.execute()).resolves.toBe(events);
    expect(readModel.findAll).toHaveBeenCalledWith(now);
  });
});
