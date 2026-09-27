import { describe, expect, it } from "vitest";
import { reserveSchema } from "./schema";

const valid = {
  ticketsQuantity: 2,
  customerFullName: "Jane Doe",
  customerEmail: "jane@example.com",
};

const messages = (input: unknown) =>
  reserveSchema(4)
    .safeParse(input)
    .error?.issues.map((i) => i.message) ?? [];

describe("reserveSchema", () => {
  it("accepts valid values", () => {
    expect(messages(valid)).toEqual([]);
  });

  it("requires a name", () => {
    expect(messages({ ...valid, customerFullName: "  " })).toEqual([
      "Name is required",
    ]);
  });

  it("rejects an invalid email", () => {
    expect(messages({ ...valid, customerEmail: "nope" })).toEqual([
      "Enter a valid email",
    ]);
  });

  it("limits quantity to what is available", () => {
    expect(messages({ ...valid, ticketsQuantity: 5 })).toEqual([
      "Only 4 tickets available",
    ]);
    expect(messages({ ...valid, ticketsQuantity: 0 })).toEqual([
      "Must be at least 1",
    ]);
  });
});
