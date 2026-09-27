import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderRoute } from "../../test/render";

it("renders the header around the page", async () => {
  renderRoute("/");
  expect(await screen.findByText("Tickets")).toBeInTheDocument();
});
