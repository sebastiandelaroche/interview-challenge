import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API, makeReservation, order } from "../fixtures";
import { renderRoute } from "../render";
import { server } from "../server";

async function openReserveModal() {
  const user = userEvent.setup();
  renderRoute("/events/evt-1");
  const [reserveVip] = await screen.findAllByRole("button", {
    name: "Reserve",
  });
  await user.click(reserveVip);
  const modal = await screen.findByRole("dialog");
  return { user, modal: within(modal) };
}

async function clickConfirm() {
  const user = userEvent.setup();
  renderRoute("/reservations/res-1");
  await user.click(
    await screen.findByRole("button", { name: "Confirm Order" }),
  );
}

describe("Frontend (functional)", () => {
  describe("1. Events list renders event cards from store data", () => {
    it("renders an event card for each event", async () => {
      renderRoute("/");

      expect(await screen.findByText("Rock Night")).toBeInTheDocument();
      expect(screen.getByText("Jazz Evening")).toBeInTheDocument();
      expect(screen.getAllByText("4 tickets available")).toHaveLength(2);
    });
  });

  describe("2. Event detail shows tier information with availability", () => {
    it("shows each tier's name, price and availability", async () => {
      renderRoute("/events/evt-1");

      expect(await screen.findByText("VIP")).toBeInTheDocument();
      expect(screen.getByText("$150.00")).toBeInTheDocument();
      expect(screen.getByText("4 left")).toBeInTheDocument();

      expect(screen.getByText("General")).toBeInTheDocument();
      expect(screen.getByText("Sold out")).toBeInTheDocument();
    });
  });

  describe("3. Reservation form validates required fields and email format", () => {
    it("shows validation errors and does not submit", async () => {
      const createReservation = vi.fn();
      server.use(http.post(`${API}/reservations`, createReservation));
      const { user, modal } = await openReserveModal();

      await user.click(modal.getByRole("button", { name: "Reserve" }));
      expect(await modal.findByText("Name is required")).toBeInTheDocument();
      expect(modal.getByText("Enter a valid email")).toBeInTheDocument();

      await user.type(modal.getByLabelText("Full name"), "Jane Doe");
      await user.type(modal.getByLabelText("Email"), "not-an-email");
      await user.click(modal.getByRole("button", { name: "Reserve" }));

      expect(await modal.findByText("Enter a valid email")).toBeInTheDocument();
      await waitFor(() =>
        expect(modal.queryByText("Name is required")).not.toBeInTheDocument(),
      );
      expect(createReservation).not.toHaveBeenCalled();
    });
  });

  describe("4. Reservation page displays hold information and expiry", () => {
    it("shows the countdown, expiry time and summary", async () => {
      renderRoute("/reservations/res-1");

      expect(
        await screen.findByText(/Tickets held for (09:5\d|10:00)/),
      ).toBeInTheDocument();
      expect(screen.getByText(/Your hold expires at/)).toBeInTheDocument();
      expect(screen.getByText("Hold expires")).toBeInTheDocument();
      expect(screen.getByText("ON HOLD")).toBeInTheDocument();
      expect(screen.getByText("$300.00")).toBeInTheDocument();
    });

    it("shows an expired message once the hold is past its expiry", async () => {
      server.use(
        http.get(`${API}/reservations/:id`, () =>
          HttpResponse.json(
            makeReservation({
              expiresAt: new Date(Date.now() - 1000).toISOString(),
            }),
          ),
        ),
      );
      renderRoute("/reservations/res-1");

      expect(
        await screen.findByText("Your hold has expired"),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Confirm Order" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("5. Confirm action dispatches correct mutation and shows order on success", () => {
    it("calls confirm for the reservation and shows the order", async () => {
      let confirmedId: unknown;
      const confirm = vi.fn(() => HttpResponse.json(order));
      server.use(
        http.post(`${API}/reservations/:id/confirm`, ({ params }) => {
          confirmedId = params.id;
          return confirm();
        }),
      );

      await clickConfirm();

      expect(await screen.findByText("Order confirmed")).toBeInTheDocument();
      expect(screen.getByText("ord-1")).toBeInTheDocument();
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(confirmedId).toBe("res-1");
    });
  });

  describe("6. Error states render appropriate messages", () => {
    it("shows an error when events fail to load", async () => {
      server.use(
        http.get(`${API}/events`, () =>
          HttpResponse.json({ message: "Service down" }, { status: 500 }),
        ),
      );
      renderRoute("/");

      expect(
        await screen.findByText("Could not load data"),
      ).toBeInTheDocument();
      expect(screen.getByText("Service down")).toBeInTheDocument();
    });

    it("shows an error when the event is not found", async () => {
      server.use(
        http.get(`${API}/events/:id`, () =>
          HttpResponse.json({ message: "Event not found" }, { status: 404 }),
        ),
      );
      renderRoute("/events/missing");

      expect(await screen.findByText("Event not found")).toBeInTheDocument();
    });

    it("shows a message when tickets are no longer available (409)", async () => {
      server.use(
        http.post(`${API}/reservations`, () =>
          HttpResponse.json({ message: "Conflict" }, { status: 409 }),
        ),
      );
      const { user, modal } = await openReserveModal();

      await user.type(modal.getByLabelText("Full name"), "Jane Doe");
      await user.type(modal.getByLabelText("Email"), "jane@example.com");
      await user.click(modal.getByRole("button", { name: "Reserve" }));

      expect(
        await modal.findByText(/Not enough tickets left/),
      ).toBeInTheDocument();
    });

    it("shows an expired message when confirm returns 410", async () => {
      server.use(
        http.post(`${API}/reservations/:id/confirm`, () =>
          HttpResponse.json({ message: "Hold expired" }, { status: 410 }),
        ),
      );

      await clickConfirm();

      expect(
        await screen.findByText("Your hold has expired"),
      ).toBeInTheDocument();
    });

    it("shows the API error when confirm fails", async () => {
      server.use(
        http.post(`${API}/reservations/:id/confirm`, () =>
          HttpResponse.json({ message: "Payment failed" }, { status: 500 }),
        ),
      );

      await clickConfirm();

      expect(await screen.findByText("Payment failed")).toBeInTheDocument();
    });
  });
});
