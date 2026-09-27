import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { PageState } from "./PageState";

it("renders children when ready", () => {
  render(<PageState isLoading={false}>content</PageState>);
  expect(screen.getByText("content")).toBeInTheDocument();
});

it("renders the error", () => {
  render(
    <PageState isLoading={false} error="Boom">
      content
    </PageState>,
  );
  expect(screen.getByText("Boom")).toBeInTheDocument();
});

it("renders the empty state", () => {
  render(
    <PageState isLoading={false} isEmpty emptyText="Nothing here">
      content
    </PageState>,
  );
  expect(screen.getByText("Nothing here")).toBeInTheDocument();
});
