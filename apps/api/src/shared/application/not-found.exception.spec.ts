import { NotFoundException } from './not-found.exception';

describe('NotFoundException', () => {
  it('names the resource and id', () => {
    const error = new NotFoundException('Event', 'abc');

    expect(error).toMatchObject({
      name: 'NotFoundException',
      message: 'Event with id abc was not found',
      resource: 'Event',
      id: 'abc',
    });
  });
});
