import { expect, it } from "vitest";
import { baseApi } from "../shared/api/baseApi";
import { makeStore } from "./store";

it("registers the api reducer", () => {
  expect(makeStore().getState()).toHaveProperty(baseApi.reducerPath);
});
