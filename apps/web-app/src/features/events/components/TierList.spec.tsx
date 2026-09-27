import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { event } from "../../../test/fixtures";
import { TierList } from "./TierList";

it("renders every tier", () => {
  render(<TierList tiers={event.tiers} onReserve={vi.fn()} />);
  expect(screen.getByText("VIP")).toBeInTheDocument();
  expect(screen.getByText("General")).toBeInTheDocument();
});

it("shows an empty state without tiers", () => {
  render(<TierList tiers={[]} onReserve={vi.fn()} />);
  expect(screen.getByText("No ticket tiers available")).toBeInTheDocument();
});
