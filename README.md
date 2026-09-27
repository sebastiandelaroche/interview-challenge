# Ticket Reservation

Browse events, hold tickets for 10 minutes, then confirm or cancel the reservation.

## Architecture

The project is a **monorepo managed by Yarn workspaces**, with two apps:

- **API**: NestJS, following **Clean Architecture** with a **lightweight DDD** approach (domain, application, infrastructure and presentation layers per module). Postgres stores events and reservations; Mongo stores confirmed orders.
- **Web app**: React + Vite, organized with a **feature-based architecture** (each feature owns its pages and components).

```
apps/
├── api/                  → details in apps/api/README.md
│   └── src/
│       ├── modules/
│       │   ├── event/
│       │   └── reservation/
│       │       ├── domain/
│       │       ├── application/
│       │       ├── infrastructure/
│       │       └── presentation/
│       └── shared/
└── web-app/              → details in apps/web-app/README.md
    └── src/
        ├── app/
        ├── features/
        │   ├── events/
        │   └── reservations/
        └── shared/
```

More detail: [API README](apps/api/README.md) · [Web app README](apps/web-app/README.md)

## Setup

Requirements: Docker, and for local development Node 24 (Yarn is enabled through corepack).

Main `make` commands (run `make help` for all of them):

| Command                | What it does                                                              |
| ---------------------- | ------------------------------------------------------------------------- |
| `make setup`           | Builds and runs everything in Docker, then seeds the database             |
| `make down`            | Stops all containers                                                      |
| `make dev-setup`       | First-time local setup: dependencies, `.env`, databases, migrations, seed |
| `make dev`             | Starts the databases, then the API and web app in watch mode              |
| `make db-reset`        | Deletes all database data and starts the databases fresh                  |
| `make test-unit`       | Unit tests for the API and web app                                        |
| `make test-functional` | Web app functional tests (API mocked with MSW)                            |
| `make test-e2e`        | API end-to-end tests against real, separate `*_test` databases            |
| `make test`            | Every test suite                                                          |

## Running the project

```bash
make setup
```

Then open the web app at http://localhost:5173 (API at http://localhost:3000, Swagger at http://localhost:3000/docs).

> **Note:** under the hood `make setup` runs `docker compose up -d`, which simulates production: the API applies migrations on startup, a one-off `seed` container loads sample events, and nginx serves the built web app. For day-to-day development use `make dev-setup` once and then `make dev` for hot reload. Run tests with `make test-unit`, `make test-functional` and `make test-e2e`.

## Notes and known limitations

- Ports 3000, 5173, 5432 and 27017 must be free. The Docker stack and `make dev` use the same ports, so run one or the other.
