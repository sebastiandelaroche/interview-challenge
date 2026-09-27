import { createBrowserRouter } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { NotFound } from "../shared/ui/NotFound";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        lazy: () =>
          import("../features/events/pages/EventsListPage").then((m) => ({
            Component: m.EventsListPage,
          })),
      },
      {
        path: "events/:id",
        lazy: () =>
          import("../features/events/pages/EventDetailPage").then((m) => ({
            Component: m.EventDetailPage,
          })),
      },
      {
        path: "reservations/:id",
        lazy: () =>
          import("../features/reservations/pages/ReservationPage").then(
            (m) => ({ Component: m.ReservationPage }),
          ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
