import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateReservationRequest } from './create-reservation.request';

const valid = {
  eventId: '11111111-1111-4111-8111-111111111111',
  ticketTierId: '22222222-2222-4222-8222-222222222222',
  ticketsQuantity: 2,
  customerFullName: 'Jane Doe',
  customerEmail: 'jane@example.com',
};

const invalidFields = async (body: object) => {
  const errors = await validate(
    plainToInstance(CreateReservationRequest, body),
  );
  return errors.map((e) => e.property);
};

describe('CreateReservationRequest', () => {
  it('accepts a valid body', async () => {
    await expect(invalidFields(valid)).resolves.toEqual([]);
  });

  it('reports every missing field', async () => {
    await expect(invalidFields({})).resolves.toEqual([
      'eventId',
      'ticketTierId',
      'ticketsQuantity',
      'customerFullName',
      'customerEmail',
    ]);
  });

  it.each([
    ['eventId', 'not-a-uuid'],
    ['ticketTierId', 123],
    ['ticketsQuantity', 0],
    ['ticketsQuantity', 1.5],
    ['customerFullName', ''],
    ['customerEmail', 'jane'],
  ])('rejects %s = %p', async (field, value) => {
    await expect(invalidFields({ ...valid, [field]: value })).resolves.toEqual([
      field,
    ]);
  });
});
