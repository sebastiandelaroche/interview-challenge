import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { event } from "../../../test/fixtures";
import { TierItem } from "./TierItem";

const [vip, soldOut] = event.tiers;

it("calls onReserve with the tier", async () => {
  const onReserve = vi.fn();
  render(<TierItem tier={vip} onReserve={onReserve} />);
  await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
  expect(onReserve).toHaveBeenCalledWith(vip);
});

it("disables reserve when sold out", () => {
  render(<TierItem tier={soldOut} onReserve={vi.fn()} />);
  expect(screen.getByText("Sold out")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Reserve" })).toBeDisabled();
});
