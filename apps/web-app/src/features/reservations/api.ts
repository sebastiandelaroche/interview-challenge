import { baseApi } from "../../shared/api/baseApi";
import type { CreateReservationRequest, Order, Reservation } from "./types";

export const reservationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReservation: build.query<Reservation, string>({
      query: (id) => `/reservations/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Reservation", id }],
    }),
    createReservation: build.mutation<Reservation, CreateReservationRequest>({
      query: (body) => ({ url: "/reservations", method: "POST", body }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: "Event", id: eventId },
        "Event",
      ],
    }),
    confirmReservation: build.mutation<Order, string>({
      query: (id) => ({ url: `/reservations/${id}/confirm`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Reservation", id },
        "Event",
      ],
    }),
    cancelReservation: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/reservations/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Reservation", id },
        "Event",
      ],
    }),
  }),
});

export const {
  useGetReservationQuery,
  useCreateReservationMutation,
  useConfirmReservationMutation,
  useCancelReservationMutation,
} = reservationsApi;
