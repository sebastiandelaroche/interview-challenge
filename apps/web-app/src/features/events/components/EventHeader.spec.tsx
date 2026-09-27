import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { event } from "../../../test/fixtures";
import { EventHeader } from "./EventHeader";

it("shows the event details", () => {
  render(<EventHeader event={event} />);
  expect(screen.getByText("Rock Night")).toBeInTheDocument();
  expect(screen.getByText("Arena")).toBeInTheDocument();
  expect(screen.getByText("A night of rock")).toBeInTheDocument();
});
