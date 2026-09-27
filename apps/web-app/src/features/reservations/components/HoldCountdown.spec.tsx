import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { HoldCountdown } from "./HoldCountdown";

it("shows the remaining time", () => {
  const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
  render(<HoldCountdown expiresAt={expiresAt} onExpire={vi.fn()} />);
  expect(screen.getByText(/Tickets held for 0[45]:\d\d/)).toBeInTheDocument();
});

it("calls onExpire when the hold has lapsed", () => {
  const onExpire = vi.fn();
  render(
    <HoldCountdown expiresAt={new Date(0).toISOString()} onExpire={onExpire} />,
  );
  expect(onExpire).toHaveBeenCalled();
});
