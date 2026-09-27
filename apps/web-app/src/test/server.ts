import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { API, event, makeReservation, order, otherEvent } from "./fixtures";

export const server = setupServer(
  http.get(`${API}/events`, () => HttpResponse.json([event, otherEvent])),
  http.get(`${API}/events/:id`, () => HttpResponse.json(event)),
  http.get(`${API}/reservations/:id`, () =>
    HttpResponse.json(makeReservation()),
  ),
  http.post(`${API}/reservations/:id/confirm`, () => HttpResponse.json(order)),
);
