import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Providers } from "./providers";

it("renders children", () => {
  render(<Providers>hello</Providers>);
  expect(screen.getByText("hello")).toBeInTheDocument();
});
