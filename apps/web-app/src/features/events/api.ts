import { baseApi } from "../../shared/api/baseApi";
import type { Event } from "./types";

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEvents: build.query<Event[], void>({
      query: () => "/events",
      providesTags: ["Event"],
    }),
    getEvent: build.query<Event, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Event", id }],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventQuery } = eventsApi;
