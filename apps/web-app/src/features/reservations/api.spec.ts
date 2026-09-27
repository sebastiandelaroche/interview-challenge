import { http, HttpResponse } from "msw";
import { expect, it } from "vitest";
import { makeStore } from "../../app/store";
import { API, makeReservation, order } from "../../test/fixtures";
import { server } from "../../test/server";
import { reservationsApi } from "./api";

const { endpoints } = reservationsApi;

it("gets a reservation", async () => {
  const result = await makeStore().dispatch(
    endpoints.getReservation.initiate("res-1"),
  );
  expect(result.data?.id).toBe("res-1");
});

it("creates a reservation", async () => {
  server.use(
    http.post(`${API}/reservations`, () =>
      HttpResponse.json(makeReservation()),
    ),
  );

  const created = await makeStore()
    .dispatch(
      endpoints.createReservation.initiate({
        eventId: "evt-1",
        ticketTierId: "tier-vip",
        ticketsQuantity: 2,
        customerFullName: "Jane Doe",
        customerEmail: "jane@example.com",
      }),
    )
    .unwrap();

  expect(created.id).toBe("res-1");
});

it("confirms a reservation", async () => {
  const confirmed = await makeStore()
    .dispatch(endpoints.confirmReservation.initiate("res-1"))
    .unwrap();

  expect(confirmed).toEqual(order);
});

it("cancels a reservation", async () => {
  server.use(
    http.delete(`${API}/reservations/:id`, () =>
      HttpResponse.json({ message: "Cancelled" }),
    ),
  );

  const cancelled = await makeStore()
    .dispatch(endpoints.cancelReservation.initiate("res-1"))
    .unwrap();

  expect(cancelled.message).toBe("Cancelled");
});
