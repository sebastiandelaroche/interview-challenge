import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderRoute } from "../../../test/render";

it("renders the reservation", async () => {
  renderRoute("/reservations/res-1");
  expect(await screen.findByText("Your reservation")).toBeInTheDocument();
});
