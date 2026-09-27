.DEFAULT_GOAL := help
.PHONY: help setup down seed dev-setup install env db-up db-down db-reset migrate db-seed dev dev-api dev-web build test test-unit test-e2e test-functional lint clean

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# ─── Docker (production-like) ────────────────────────────────────────────────

setup: ## Build and run everything in Docker (dbs, api:3000, web-app:5173) and seed
	docker compose up -d --build
	docker compose wait seed
	@echo "✅ Web app: http://localhost:5173 · API: http://localhost:3000/docs"

down: ## Stop all containers (keeps data)
	docker compose down

seed: ## Re-run the seed against the Docker stack
	docker compose run --rm seed

# ─── Local development ───────────────────────────────────────────────────────

dev-setup: install env db-up migrate db-seed ## First-time local setup: deps, .env, databases, migrations, seed
	@echo "✅ Local setup complete. Run 'make dev' to start the apps."

install: ## Enable corepack and install all workspace dependencies
	corepack enable
	yarn install

env: ## Create .env files from .env.example where missing
	@for dir in . apps/api apps/web-app; do \
		if [ -f $$dir/.env.example ] && [ ! -f $$dir/.env ]; then \
			cp $$dir/.env.example $$dir/.env && echo "Created $$dir/.env"; \
		fi; \
	done

db-up: ## Start only Postgres and Mongo and wait until healthy
	docker compose up -d --wait postgres mongo

db-down: ## Stop the databases (keeps data)
	docker compose stop postgres mongo

db-reset: ## Delete all database data and start them fresh
	docker compose down -v
	docker compose up -d --wait postgres mongo

migrate: ## Apply Prisma migrations to the local database
	yarn workspace api prisma migrate deploy

db-seed: ## Seed the local database
	yarn workspace api prisma:seed

dev: db-up ## Start databases, then API and web app in watch mode
	yarn dev

dev-api: db-up ## Start databases and the API only
	yarn workspace api dev

dev-web: ## Start the web app only
	yarn workspace web-app dev

# ─── Quality ─────────────────────────────────────────────────────────────────

test: test-unit test-functional test-e2e ## Run every test suite

test-unit: ## Unit tests (API + web app)
	yarn workspace api test
	yarn workspace web-app test:unit

test-functional: ## Web app functional tests (API mocked with MSW)
	yarn workspace web-app test:functional

test-e2e: db-up ## API e2e tests against real *_test databases
	yarn workspace api test:e2e

build: ## Build all workspaces
	yarn workspaces foreach -Apt run build

lint: ## Lint all workspaces
	yarn workspaces foreach -Ap run lint

clean: ## Remove node_modules and build outputs
	rm -rf node_modules apps/*/node_modules apps/*/dist
