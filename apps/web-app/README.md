# Web app

React + Vite single-page app for browsing events, holding tickets and confirming or cancelling reservations.

## Architecture

The web app uses a **feature-based architecture**: code is grouped by business feature (`events`, `reservations`) rather than by technical type (all components in one folder, all hooks in another). Everything a feature needs (pages, components, API endpoints, types, validation) lives in its folder, so a change to one feature usually touches one folder.

The `src/` folder has three layers, and imports only point downward:

```
app → features → shared
```

- **app**: wires the application together: router, Redux store, providers and the page layout. It knows about every feature.
- **features**: one folder per feature. A feature can use `shared` and, when it's truly part of the flow, another feature's public pieces (e.g. the event detail page opens the reservation modal).
- **shared**: generic code with no feature knowledge: the base API client, error helpers, formatters and UI building blocks.

### Data flow

Server state is handled by **RTK Query**, not hand-written Redux slices:

- `shared/api/baseApi.ts` creates one API client (base URL `/api`) with no endpoints.
- Each feature adds its own endpoints with `baseApi.injectEndpoints` in its `api.ts`, and uses the generated hooks (`useGetEventQuery`, `useCreateReservationMutation`, …) in its pages.
- Cache tags keep data fresh: creating, confirming or cancelling a reservation invalidates the `Event` tag, so availability is refetched automatically.

Forms use **React Hook Form** with **Zod** schemas (e.g. `reservations/schema.ts` checks the quantity against the tickets still available). UI components come from **Ant Design**.

## Scaffolding

The `reservations` feature as an example (tests sit next to each file as `*.spec.ts(x)`, omitted here):

```
src/features/reservations/
├── api.ts                        # RTK Query endpoints: get, create, confirm, cancel
├── types.ts                      # Reservation and Order types (match the API responses)
├── schema.ts                     # Zod schema for the reservation form
├── pages/
│   └── ReservationPage.tsx       # /reservations/:id: hold details, confirm and cancel actions
└── components/
    ├── ReserveModal.tsx          # Reservation form; navigates to the reservation page on success
    ├── ReservationSummary.tsx    # Event, tier, quantity, customer and total
    ├── HoldCountdown.tsx         # Time left before the 10-minute hold expires
    └── OrderResult.tsx           # Order shown after a successful confirmation
```

## Structure

- `src/main.tsx`: entry point, renders the providers and router
- `src/app/`: `router.tsx` (routes), `store.ts` (Redux store), `providers.tsx`, `layout/`
- `src/features/`: `events` and `reservations`, each with the layout shown above
- `src/shared/api/`: base API client and error message helpers
- `src/shared/lib/`: formatting helpers (prices, dates)
- `src/shared/ui/`: shared components (`PageState` for loading/error states, `NotFound`)
- `src/test/`: test setup, render helper, fixtures, the MSW mock server, and the functional tests in `functional/`

## Setup

### Environment variables

| Variable       | Required | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `VITE_API_URL` | no       | API base URL, defaults to `/api`                |

No `.env` is needed by default. In development the Vite dev server proxies `/api/*` to the API at `http://localhost:3000`; in Docker, nginx does the same, forwarding to the `api` container.

### Scripts

Run from `apps/web-app` with `yarn <script>` (or from the root with `yarn workspace web-app <script>`):

| Script            | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `dev`             | Start the Vite dev server with hot reload on port 5173              |
| `build`           | Type-check and build to `dist/`                                     |
| `preview`         | Serve the built `dist/` locally                                     |
| `test`            | All tests (unit + functional) with Vitest                           |
| `test:unit`       | Unit tests only: components, pages, API endpoints, schemas          |
| `test:functional` | Functional tests: full user flows with the API mocked by MSW        |
| `test:watch`      | Tests in watch mode                                                 |
| `test:coverage`   | Tests with a coverage report                                        |
| `lint`            | Lint with ESLint                                                    |

Tests don't need the API running: MSW intercepts every request. `yarn dev` needs the API on port 3000 (from the repo root, `make dev` starts both).

## Pages

| Route               | Page                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| `/`                 | Events list                                                            |
| `/events/:id`       | Event detail: ticket tiers with availability and the reservation form |
| `/reservations/:id` | Reservation: hold countdown, confirm and cancel actions               |
| `*`                 | Not found                                                              |
