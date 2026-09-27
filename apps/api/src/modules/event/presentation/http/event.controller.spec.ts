import { GetEventQuery, ListEventsQuery } from '../../application/queries';
import { EventController } from './event.controller';

describe('EventController', () => {
  const events = [{ id: 'e1' }];
  const listEvents = { execute: jest.fn().mockResolvedValue(events) };
  const getEvent = { execute: jest.fn().mockResolvedValue(events[0]) };
  const controller = new EventController(
    listEvents as unknown as ListEventsQuery,
    getEvent as unknown as GetEventQuery,
  );

  it('GET /events lists all events', async () => {
    await expect(controller.findAll()).resolves.toBe(events);
  });

  it('GET /events/:id returns one event', async () => {
    await expect(controller.findOne('e1')).resolves.toBe(events[0]);
    expect(getEvent.execute).toHaveBeenCalledWith({ id: 'e1' });
  });
});
