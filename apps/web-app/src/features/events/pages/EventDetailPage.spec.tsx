import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderRoute } from "../../../test/render";

it("renders the event detail", async () => {
  renderRoute("/events/evt-1");
  expect(await screen.findByText("A night of rock")).toBeInTheDocument();
});
