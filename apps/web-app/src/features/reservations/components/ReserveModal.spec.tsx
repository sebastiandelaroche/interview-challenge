import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { event } from "../../../test/fixtures";
import { renderWithProviders } from "../../../test/render";
import { ReserveModal } from "./ReserveModal";

const tier = event.tiers[0];

it("shows the tier and total", () => {
  renderWithProviders(
    <ReserveModal
      eventId="evt-1"
      tier={tier}
      onClose={vi.fn()}
      onConflict={vi.fn()}
    />,
  );
  expect(screen.getByText("Reserve · VIP")).toBeInTheDocument();
  expect(screen.getByText("Total: $150.00")).toBeInTheDocument();
});

it("calls onClose on cancel", async () => {
  const onClose = vi.fn();
  renderWithProviders(
    <ReserveModal
      eventId="evt-1"
      tier={tier}
      onClose={onClose}
      onConflict={vi.fn()}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onClose).toHaveBeenCalled();
});
