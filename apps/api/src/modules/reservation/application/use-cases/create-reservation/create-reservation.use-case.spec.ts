import { Clock, NotFoundException } from '@shared/application';
import {
  Event,
  EventDate,
  EventLocation,
  EventName,
  EventRepository,
  TicketTier,
  TicketTierCapacity,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import {
  InsufficientTicketsException,
  LockedTierReservations,
  Reservation,
  ReservationRepository,
} from '@modules/reservation/domain';
import { CreateReservationUseCase } from './create-reservation.use-case';

const now = new Date('2026-01-01T10:00:00Z');

class FixedClock extends Clock {
  now = () => Promise.resolve(now);
}

// In-memory fakes: they only implement what the use case touches.
class FakeEventRepository extends EventRepository {
  constructor(private readonly events: Event[]) {
    super();
  }
  findById = (id: string) =>
    Promise.resolve(this.events.find((e) => e.id === id) ?? null);
  getByTicketTierId = () => Promise.reject(new Error('not used'));
}

class FakeReservationRepository extends ReservationRepository {
  saved: Reservation[] = [];
  constructor(private readonly taken: number) {
    super();
  }
  withTicketTierLock<T>(
    _tierId: string,
    work: (locked: LockedTierReservations) => Promise<T>,
  ): Promise<T> {
    return work({
      sumTakenTickets: () => Promise.resolve(this.taken),
      save: (r) => {
        this.saved.push(r);
        return Promise.resolve();
      },
    });
  }
  findById = () => Promise.reject(new Error('not used'));
  withReservationLock = () => Promise.reject(new Error('not used'));
  expireLapsedHolds = () => Promise.reject(new Error('not used'));
}

const tier = TicketTier.create({
  name: TicketTierName.create('General'),
  capacity: TicketTierCapacity.create(10),
  price: TicketTierPrice.create(25),
});
const event = Event.create({
  name: EventName.create('Rock Night'),
  date: EventDate.create(new Date(Date.now() + 86_400_000)),
  location: EventLocation.create('Arena'),
  tiers: [tier],
});

const input = (overrides: Record<string, unknown> = {}) => ({
  eventId: event.id,
  ticketTierId: tier.id,
  ticketsQuantity: 2,
  customerFullName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  ...overrides,
});

const setup = (taken = 0) => {
  const reservations = new FakeReservationRepository(taken);
  const useCase = new CreateReservationUseCase(
    new FakeEventRepository([event]),
    reservations,
    new FixedClock(),
  );
  return { useCase, reservations };
};

describe('CreateReservationUseCase', () => {
  it('saves an on-hold reservation and returns it with pricing', async () => {
    const { useCase, reservations } = setup(3);

    const result = await useCase.execute(input());

    expect(reservations.saved).toHaveLength(1);
    expect(result).toMatchObject({
      status: 'on-hold',
      ticketsQuantity: 2,
      totalPrice: 50,
      event: { id: event.id },
      tier: { id: tier.id },
    });
  });

  it('throws NotFound when the event does not exist', async () => {
    const { useCase } = setup();

    await expect(
      useCase.execute(
        input({ eventId: '22222222-2222-4222-8222-222222222222' }),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFound when the tier is not part of the event', async () => {
    const { useCase } = setup();

    await expect(
      useCase.execute(
        input({ ticketTierId: '33333333-3333-4333-8333-333333333333' }),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('refuses and saves nothing when not enough tickets are left', async () => {
    const { useCase, reservations } = setup(9);

    await expect(useCase.execute(input())).rejects.toThrow(
      InsufficientTicketsException,
    );
    expect(reservations.saved).toHaveLength(0);
  });
});
