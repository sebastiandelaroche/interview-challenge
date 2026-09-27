import type { Event } from "../features/events/types";
import type { Order, Reservation } from "../features/reservations/types";

export const API = "http://localhost/api";

const inMinutes = (minutes: number) =>
  new Date(Date.now() + minutes * 60_000).toISOString();

export const event: Event = {
  id: "evt-1",
  name: "Rock Night",
  date: "2026-12-01T20:00:00.000Z",
  location: "Arena",
  description: "A night of rock",
  tiers: [
    { id: "tier-vip", name: "VIP", price: 150, capacity: 10, available: 4 },
    { id: "tier-ga", name: "General", price: 50, capacity: 100, available: 0 },
  ],
};

export const otherEvent: Event = {
  ...event,
  id: "evt-2",
  name: "Jazz Evening",
};

export const makeReservation = (
  overrides: Partial<Reservation> = {},
): Reservation => ({
  id: "res-1",
  event: { id: event.id, name: event.name },
  tier: { id: "tier-vip", name: "VIP", unitPrice: 150 },
  ticketsQuantity: 2,
  totalPrice: 300,
  customer: { fullName: "Jane Doe", email: "jane@example.com" },
  status: "on-hold",
  createdAt: inMinutes(0),
  expiresAt: inMinutes(10),
  ...overrides,
});

export const order: Order = {
  id: "ord-1",
  reservationId: "res-1",
  event: { id: event.id, name: event.name },
  tier: { id: "tier-vip", name: "VIP", unitPrice: 150 },
  ticketsQuantity: 2,
  totalPrice: 300,
  customer: { fullName: "Jane Doe", email: "jane@example.com" },
  status: "confirmed",
  createdAt: inMinutes(0),
};
