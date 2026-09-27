import { expect, it } from "vitest";
import { makeStore } from "../../app/store";
import { event } from "../../test/fixtures";
import { eventsApi } from "./api";

it("fetches events and a single event", async () => {
  const store = makeStore();
  const list = await store.dispatch(eventsApi.endpoints.getEvents.initiate());
  const one = await store.dispatch(
    eventsApi.endpoints.getEvent.initiate("evt-1"),
  );
  expect(list.data).toHaveLength(2);
  expect(one.data).toEqual(event);
});
