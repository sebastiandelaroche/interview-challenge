import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { makeReservation } from "../../../test/fixtures";
import { ReservationSummary } from "./ReservationSummary";

it("shows reservation details and expiry when on hold", () => {
  render(
    <ReservationSummary reservation={makeReservation()} status="on-hold" />,
  );
  expect(screen.getByText("res-1")).toBeInTheDocument();
  expect(screen.getByText("ON HOLD")).toBeInTheDocument();
  expect(screen.getByText("Hold expires")).toBeInTheDocument();
});

it("hides expiry once confirmed", () => {
  render(
    <ReservationSummary reservation={makeReservation()} status="confirmed" />,
  );
  expect(screen.queryByText("Hold expires")).not.toBeInTheDocument();
});
