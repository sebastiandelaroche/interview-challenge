import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { event } from "../../../test/fixtures";
import { renderWithProviders } from "../../../test/render";
import { EventCard } from "./EventCard";

it("shows the event name and availability", () => {
  renderWithProviders(<EventCard event={event} />);
  expect(screen.getByText("Rock Night")).toBeInTheDocument();
  expect(screen.getByText("4 tickets available")).toBeInTheDocument();
});

it("shows sold out when no tickets are left", () => {
  const tiers = event.tiers.map((t) => ({ ...t, available: 0 }));
  renderWithProviders(<EventCard event={{ ...event, tiers }} />);
  expect(screen.getByText("Sold out")).toBeInTheDocument();
});
