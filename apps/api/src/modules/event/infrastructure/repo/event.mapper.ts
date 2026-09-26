import {
  Event,
  EventDate,
  EventId,
  EventLocation,
  EventName,
  TicketTier,
  TicketTierCapacity,
  TicketTierId,
  TicketTierName,
  TicketTierPrice,
} from '@modules/event/domain';
import { Prisma } from '@shared/infrastructure/database';

export type PrismaEventWithTiers = Prisma.EventGetPayload<{
  include: { tiers: true };
}>;
type PrismaTicketTier = PrismaEventWithTiers['tiers'][number];

// Persisted data is trusted: cast to branded types instead of re-running
// creation rules (e.g. EventDate rejects past dates, which would break reads).
export const EventMapper = {
  toDomain(row: PrismaEventWithTiers): Event {
    return Event.hydrate({
      id: row.id as EventId,
      name: row.name as EventName,
      date: row.date as EventDate,
      location: row.location as EventLocation,
      description: row.description,
      tiers: row.tiers.map(EventMapper.tierToDomain),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },

  tierToDomain(row: PrismaTicketTier): TicketTier {
    return TicketTier.hydrate({
      id: row.id as TicketTierId,
      name: row.name as TicketTierName,
      capacity: row.capacity as TicketTierCapacity,
      price: row.price.toNumber() as TicketTierPrice,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  },
};
