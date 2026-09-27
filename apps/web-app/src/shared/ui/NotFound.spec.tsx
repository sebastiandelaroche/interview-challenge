import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderRoute } from "../../test/render";

it("renders for unknown routes", async () => {
  renderRoute("/nope");
  expect(await screen.findByText("Page not found")).toBeInTheDocument();
});
