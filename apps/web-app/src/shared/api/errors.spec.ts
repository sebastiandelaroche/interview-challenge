import { describe, expect, it } from "vitest";
import { getErrorMessage, isConflict, isGone } from "./errors";

describe("getErrorMessage", () => {
  it("returns the API message", () => {
    expect(getErrorMessage({ status: 400, data: { message: "Bad" } })).toBe(
      "Bad",
    );
  });

  it("joins validation message arrays", () => {
    expect(
      getErrorMessage({ status: 400, data: { message: ["a", "b"] } }),
    ).toBe("a, b");
  });

  it("uses the serialized error message", () => {
    expect(getErrorMessage({ message: "Network down" })).toBe("Network down");
  });

  it("falls back when there is no message", () => {
    expect(getErrorMessage(undefined)).toBe("Something went wrong");
    expect(getErrorMessage({ status: 500, data: {} }, "Oops")).toBe("Oops");
  });
});

describe("status helpers", () => {
  it("detects 409 and 410", () => {
    expect(isConflict({ status: 409, data: null })).toBe(true);
    expect(isConflict({ status: 410, data: null })).toBe(false);
    expect(isGone({ status: 410, data: null })).toBe(true);
    expect(isGone(undefined)).toBe(false);
  });
});
