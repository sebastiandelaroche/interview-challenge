import { Prisma } from '@shared/infrastructure/database';
import { EventView } from '../../application/read-models';

export type EventTierRow = {
  event_id: string;
  event_name: string;
  event_date: Date;
  event_location: string;
  event_description: string;
  tier_id: string | null;
  tier_name: string | null;
  tier_price: Prisma.Decimal | null;
  tier_capacity: number | null;
  taken: number;
};

// Rows are one per (event, tier) from a LEFT JOIN; fold them back into events.
export const EventViewMapper = {
  toViews(rows: EventTierRow[]): EventView[] {
    const events = new Map<string, EventView>();
    for (const row of rows) {
      let event = events.get(row.event_id);
      if (!event) {
        event = {
          id: row.event_id,
          name: row.event_name,
          date: row.event_date,
          location: row.event_location,
          description: row.event_description,
          tiers: [],
        };
        events.set(row.event_id, event);
      }
      if (row.tier_id !== null) {
        const capacity = row.tier_capacity!;
        event.tiers.push({
          id: row.tier_id,
          name: row.tier_name!,
          price: Number(row.tier_price),
          capacity,
          available: Math.max(0, capacity - row.taken),
        });
      }
    }
    return [...events.values()];
  },
};
