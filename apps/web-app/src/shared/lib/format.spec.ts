import { describe, expect, it } from "vitest";
import { formatDate, formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats USD", () => {
    expect(formatMoney(1234.5)).toBe("$1,234.50");
  });
});

describe("formatDate", () => {
  it("formats a readable date", () => {
    expect(formatDate("2026-12-01T20:00:00")).toBe(
      "Tue, Dec 1, 2026 · 8:00 PM",
    );
  });
});
