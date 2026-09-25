.DEFAULT_GOAL := help
.PHONY: help setup install env db-up db-down db-reset db-logs dev dev-api dev-web build test lint clean

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

setup: install env db-up ## Full first-time setup: deps, env files, databases
	@echo "✅ Setup complete. Run 'make dev' to start the apps."

install: ## Enable corepack and install all workspace dependencies
	corepack enable
	yarn install

env: ## Create .env files from .env.example where missing
	@for dir in . apps/api apps/web-app; do \
		if [ -f $$dir/.env.example ] && [ ! -f $$dir/.env ]; then \
			cp $$dir/.env.example $$dir/.env && echo "Created $$dir/.env"; \
		fi; \
	done

db-up: ## Start Postgres and Mongo and wait until healthy
	docker compose up -d --wait

db-down: ## Stop the databases (keeps data)
	docker compose down

db-reset: ## Stop the databases and delete all their data
	docker compose down -v
	docker compose up -d --wait


dev: db-up ## Start databases, API and web app
	yarn dev

dev-api: db-up ## Start databases and the API only
	yarn workspace api dev

dev-web: ## Start the web app only
	yarn workspace web-app dev

build: ## Build all workspaces
	yarn workspaces foreach -Apt run build

test: ## Run tests in all workspaces
	yarn workspaces foreach -Ap run test

lint: ## Lint all workspaces
	yarn workspaces foreach -Ap run lint

clean: ## Remove node_modules and build outputs
	rm -rf node_modules apps/*/node_modules apps/*/dist
