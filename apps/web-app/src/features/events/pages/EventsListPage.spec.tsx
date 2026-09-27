import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderRoute } from "../../../test/render";

it("renders the events list", async () => {
  renderRoute("/");
  expect(await screen.findByText("Rock Night")).toBeInTheDocument();
});
