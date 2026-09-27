# API

NestJS REST API for events and ticket reservations.

## Architecture

The API follows **Clean Architecture** with a **lightweight DDD** approach. Each business module (`event`, `reservation`) is split into four layers, and dependencies only point inward:

```
presentation → application → domain ← infrastructure
```

- **Domain**: the business model in plain TypeScript, with no NestJS, Prisma or Mongo code. Aggregates (`Reservation`, `Order`) protect their own rules, for example a hold can't be confirmed after it expires. Value objects (`CustomerEmail`, `TicketsQuantity`, …) validate themselves when created. Repositories are declared here as abstract classes.
- **Application**: one class per use case (writes, e.g. `CreateReservationUseCase`) or query (reads, e.g. `GetReservationQuery`). Use cases load aggregates, call their methods and save them through the repository abstractions.
- **Infrastructure**: the implementations of those abstractions: Prisma repositories for Postgres, a Mongo repository for orders, and mappers between database rows and domain objects.
- **Presentation**: HTTP controllers, request/response DTOs, and the cron job. Domain exceptions are mapped to HTTP status codes here, so the domain never knows about HTTP.

It's "lightweight" DDD because it keeps the parts that pay off (aggregates, value objects, repositories, a ubiquitous language) and skips the heavier ones (no CQRS bus, event sourcing or separate bounded-context services). Reads use simple read models that query Postgres directly instead of loading aggregates.

The module file wires it together, binding each abstraction to its implementation:

```ts
{ provide: ReservationRepository, useClass: PostgresReservationImplRepo },
{ provide: OrderRepository, useClass: MongoOrderImplRepo },
```

## Scaffolding

The `reservation` module as an example (tests sit next to each file as `*.spec.ts`, omitted here):

```
src/modules/reservation/
├── domain/
│   ├── reservation.ts                    # Reservation aggregate (hold, confirm, cancel, expire)
│   ├── order.ts                          # Order aggregate, created on confirmation
│   ├── reservation.service.ts            # Domain rule spanning data: ticket availability check
│   ├── reservation.exceptions.ts         # Domain errors (expired, not enough tickets, …)
│   ├── reservation.repository.ts         # Repository abstraction (with row-lock operations)
│   ├── order.repository.ts
│   └── values/                           # Value objects: ReservationId, CustomerEmail, TicketsQuantity, …
├── application/
│   ├── use-cases/
│   │   ├── create-reservation/           # create-reservation.use-case.ts + .dto.ts
│   │   ├── confirm-reservation/
│   │   ├── cancel-reservation/
│   │   └── expire-reservations/
│   ├── queries/
│   │   └── get-reservation/
│   └── read-models/                      # Read-side abstraction + view types
├── infrastructure/
│   ├── repo/
│   │   ├── postgres-reservation-impl.repo.ts
│   │   ├── mongo-order-impl.repo.ts
│   │   └── *.mapper.ts                   # Row/document ↔ domain object
│   └── read/
│       └── postgres-reservation-read-model.ts
├── presentation/
│   ├── http/
│   │   ├── reservation.controller.ts
│   │   ├── reservation.exception-mappings.ts   # Domain exception → HTTP status
│   │   └── dto/                          # Request validation + Swagger response types
│   └── schedule/
│       └── expire-reservations.cron.ts   # Every minute: mark expired holds
└── reservation.module.ts                 # Nest module: binds abstractions to implementations
```

## Structure

- `src/modules/`: business modules (`event`, `reservation`), each split into the layers above
- `src/shared/domain/`: base building blocks (`Entity`, `AggregateRoot`, `ValueObject`, `DomainException`)
- `src/shared/application/`: `UseCase` and `Query` interfaces, the `Clock` abstraction
- `src/shared/infrastructure/`: config, database connections, system clock and the HTTP exception filter
- `src/shared/infrastructure/database/prisma/`: Prisma schema, migrations and seed
- `test/`: e2e tests

## Setup

### Environment variables

| Variable       | Required | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `POSTGRES_URL` | yes      | Postgres connection string                   |
| `MONGO_URL`    | yes      | Mongo connection string                      |
| `PORT`         | no       | HTTP port, defaults to `3000`                |

Copy `.env.example` to `.env`; its values point at the databases from the root `docker-compose.yml`. `.env.test` holds the same variables for e2e tests, pointing at separate `*_test` databases so tests never touch dev data.

### Scripts

Run from `apps/api` with `yarn <script>` (or from the root with `yarn workspace api <script>`):

| Script            | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `dev`             | Start in watch mode on port 3000                                   |
| `build` / `prod`  | Compile to `dist/` / run the compiled build                        |
| `prisma:generate` | Regenerate the Prisma client after changing `schema.prisma`        |
| `prisma:migrate`  | Create a migration from schema changes and apply it (development)  |
| `prisma:seed`     | Load sample events (idempotent, safe to re-run)                    |
| `prisma:studio`   | Open Prisma Studio to browse the Postgres data                     |
| `test`            | Unit tests                                                         |
| `test:cov`        | Unit tests with coverage report                                    |
| `test:e2e`        | End-to-end tests against real Postgres and Mongo (`.env.test`); the test databases are created automatically |
| `lint` / `format` | Lint with oxlint / format with Prettier                            |

The databases must be running for `dev`, `prisma:*` and `test:e2e`. From the repo root, `make db-up` starts them.

## Endpoints

| Method | Path                         | Description                              |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/events`                    | List events with availability per tier   |
| GET    | `/events/:id`                | Event detail                             |
| POST   | `/reservations`              | Hold tickets for 10 minutes              |
| GET    | `/reservations/:id`          | Reservation detail                       |
| POST   | `/reservations/:id/confirm`  | Confirm a hold and create an order       |
| DELETE | `/reservations/:id`          | Cancel a hold                            |

Full request/response schemas are in Swagger at http://localhost:3000/docs.
