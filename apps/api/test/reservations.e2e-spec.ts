import { randomUUID } from 'node:crypto';
import { resetDb, seedEvent } from './support/db';
import { createTestApp, TestApp } from './support/test-app';

const T0 = new Date('2026-01-01T10:00:00Z');

describe('Reservations (e2e)', () => {
  let t: TestApp;
  let eventId: string;
  let tierId: string;

  // --- helpers ---------------------------------------------------------------

  const reserve = (ticketsQuantity: number, overrides = {}) =>
    t
      .http()
      .post('/reservations')
      .send({
        eventId,
        ticketTierId: tierId,
        ticketsQuantity,
        customerFullName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        ...overrides,
      });

  const hold = async (ticketsQuantity: number): Promise<string> => {
    const res = await reserve(ticketsQuantity).expect(201);
    return res.body.id;
  };

  const confirm = (id: string) => t.http().post(`/reservations/${id}/confirm`);
  const cancel = (id: string) => t.http().delete(`/reservations/${id}`);

  const available = async (): Promise<number> => {
    const res = await t.http().get(`/events/${eventId}`).expect(200);
    return res.body.tiers.find((tier: { id: string }) => tier.id === tierId)
      .available;
  };

  // --- lifecycle -------------------------------------------------------------

  beforeAll(async () => {
    t = await createTestApp();
  });

  beforeEach(async () => {
    await resetDb(t);
    t.clock.set(T0);
    ({ eventId, tierId } = await seedEvent(t, { capacity: 10 }));
  });

  afterAll(async () => {
    await t.app.close();
  });

  // --- requirements ----------------------------------------------------------

  it('1. creating a reservation decreases tier availability', async () => {
    expect(await available()).toBe(10);

    const res = await reserve(2).expect(201);

    expect(res.body).toMatchObject({ status: 'on-hold', ticketsQuantity: 2 });
    expect(await available()).toBe(8);
  });

  it('2. cannot reserve more tickets than currently available', async () => {
    const tooMany = await reserve(11).expect(409);
    expect(tooMany.body).toMatchObject({ requested: 11, available: 10 });

    await hold(8);

    const overLimit = await reserve(3).expect(409);
    expect(overLimit.body).toMatchObject({ requested: 3, available: 2 });
    expect(await available()).toBe(2);
  });

  it('3. confirming a reservation creates a permanent order', async () => {
    const id = await hold(2);

    const res = await confirm(id).expect(200);

    expect(res.body).toMatchObject({
      reservationId: id,
      ticketsQuantity: 2,
      totalPrice: 50,
      status: 'confirmed',
    });
    const order = await t.mongo
      .collection('orders')
      .findOne({ reservationId: id });
    expect(order).not.toBeNull();

    const reservation = await t.http().get(`/reservations/${id}`).expect(200);
    expect(reservation.body.status).toBe('confirmed');
  });

  it('4. confirming an expired reservation returns 410', async () => {
    const id = await hold(2);

    t.clock.advanceMinutes(10);

    await confirm(id).expect(410);
    expect(await t.mongo.collection('orders').countDocuments()).toBe(0);
  });

  it('5. confirming an already-confirmed reservation returns 409', async () => {
    const id = await hold(2);
    await confirm(id).expect(200);

    await confirm(id).expect(409);
    expect(await t.mongo.collection('orders').countDocuments()).toBe(1);
  });

  it('6. cancelling a reservation releases tickets', async () => {
    const id = await hold(4);
    expect(await available()).toBe(6);

    await cancel(id).expect(200);

    expect(await available()).toBe(10);
  });

  it('7. cancelling an already-confirmed reservation returns 409', async () => {
    const id = await hold(3);
    await confirm(id).expect(200);

    await cancel(id).expect(409);
    expect(await available()).toBe(7);
  });

  it('8. availability calculation accounts for both confirmed orders and active holds', async () => {
    await hold(1); // created at T0, lapses at T0+10

    t.clock.advanceMinutes(6);
    await confirm(await hold(3)).expect(200); // confirmed: always counts
    await hold(2); // active until T0+16
    expect(await available()).toBe(10 - 1 - 3 - 2);

    t.clock.advanceMinutes(5); // T0+11: only the first hold has lapsed
    expect(await available()).toBe(10 - 3 - 2);

    // The freed ticket can actually be reserved again.
    await reserve(6).expect(409);
    await reserve(5).expect(201);
  });

  describe('9. validation errors return 400 with field-level messages', () => {
    it('reports every invalid field', async () => {
      const res = await t
        .http()
        .post('/reservations')
        .send({ eventId: 'x', ticketsQuantity: 0, customerEmail: 'bad' })
        .expect(400);

      const fields = res.body.errors.map((e: { field: string }) => e.field);
      expect(fields).toEqual(
        expect.arrayContaining([
          'eventId',
          'ticketTierId',
          'ticketsQuantity',
          'customerFullName',
          'customerEmail',
        ]),
      );

      expect(res.body.errors).toContainEqual({
        field: 'ticketsQuantity',
        messages: ['ticketsQuantity must not be less than 1'],
      });
      expect(Array.isArray(res.body.message)).toBe(true);
    });

    it('rejects unknown fields', async () => {
      const res = await reserve(1, { isAdmin: true }).expect(400);

      expect(res.body.errors).toContainEqual({
        field: 'isAdmin',
        messages: ['property isAdmin should not exist'],
      });
    });
  });

  describe('10. non-existent event/tier returns an appropriate error', () => {
    it('returns 404 for an unknown event', async () => {
      await reserve(1, { eventId: randomUUID() }).expect(404);
      await t.http().get(`/events/${randomUUID()}`).expect(404);
    });

    it('returns 404 for a tier that is not part of the event', async () => {
      await reserve(1, { ticketTierId: randomUUID() }).expect(404);
    });

    it('returns 404 for an unknown reservation', async () => {
      const id = randomUUID();
      await t.http().get(`/reservations/${id}`).expect(404);
      await confirm(id).expect(404);
      await cancel(id).expect(404);
    });

    it('returns 400 for a malformed id', async () => {
      await t.http().get('/reservations/not-a-uuid').expect(400);
    });
  });

  describe('11. concurrent reservations never oversell a tier', () => {
    it('lets only one of two parallel requests take the whole tier', async () => {
      const results = await Promise.all([reserve(10), reserve(10)]);

      const statuses = results.map((r) => r.status).sort();
      expect(statuses).toEqual([201, 409]);
      expect(await available()).toBe(0);
    });

    it('never sells more than capacity under many parallel requests', async () => {
      // 20 requests of 1 ticket race for 10 tickets.
      const results = await Promise.all(
        Array.from({ length: 20 }, () => reserve(1)),
      );

      const created = results.filter((r) => r.status === 201).length;
      const rejected = results.filter((r) => r.status === 409).length;
      expect(created).toBe(10);
      expect(rejected).toBe(10);
      expect(await available()).toBe(0);
    });
  });
});
