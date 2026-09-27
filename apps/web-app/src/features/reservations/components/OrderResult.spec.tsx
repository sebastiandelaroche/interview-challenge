import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { order } from "../../../test/fixtures";
import { renderWithProviders } from "../../../test/render";
import { OrderResult } from "./OrderResult";

it("shows the confirmed order", () => {
  renderWithProviders(<OrderResult order={order} />);
  expect(screen.getByText("Order confirmed")).toBeInTheDocument();
  expect(screen.getByText("ord-1")).toBeInTheDocument();
  expect(screen.getByText("CONFIRMED")).toBeInTheDocument();
});
