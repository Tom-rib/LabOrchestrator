.PHONY: help install install-serveurapp install-db configure-env setup-config dev prod build start stop restart clean logs test docker-build docker-push deploy

# Variables
BACKEND_DIR := backend
FRONTEND_DIR := frontend
IMAGE_NAME := ephemeral-labs
VERSION := 2.0.0
DOCKER_REGISTRY := docker.io
COMPOSE_FILE := docker-compose.yml

# Couleurs
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)╔════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║  Ephemeral Labs - Makefile Commands        ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Setup & Installation:$(NC)"
	@echo "  make install              - Install all dependencies"
	@echo "  make install-serveurapp   - Install server backend dependencies"
	@echo "  make configure-env        - Configure environment variables (.env)"
	@echo "  make setup-config         - Full config setup (install + configure-env)"
	@echo "  make setup                - Full setup (install + configure-env + db init)"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  make dev              - Start in development mode"
	@echo "  make dev-backend      - Start backend dev server"
	@echo "  make dev-frontend     - Start frontend dev server"
	@echo ""
	@echo "$(YELLOW)Production:$(NC)"
	@echo "  make prod             - Start in production mode (Docker)"
	@echo "  make build            - Build Docker images"
	@echo "  make start            - Start Docker containers"
	@echo "  make stop             - Stop Docker containers"
	@echo "  make restart          - Restart Docker containers"
	@echo ""
	@echo "$(YELLOW)Database:$(NC)"
	@echo "  make install-db       - Initialize and seed database"
	@echo "  make db-init          - Initialize database"
	@echo "  make db-seed          - Seed database with demo data"
	@echo "  make db-reset         - Reset database (⚠️ deletes all data)"
	@echo ""
	@echo "$(YELLOW)Maintenance:$(NC)"
	@echo "  make logs             - View Docker logs"
	@echo "  make test             - Run tests"
	@echo "  make clean            - Clean up files and containers"
	@echo "  make lint             - Lint code"
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@echo "  make docker-build     - Build Docker images"
	@echo "  make docker-push      - Push images to registry"
	@echo "  make docker-clean     - Clean Docker resources"
	@echo ""
	@echo "$(YELLOW)Deployment:$(NC)"
	@echo "  make deploy           - Deploy to production"
	@echo "  make health-check     - Check system health"
	@echo ""

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

install: install-backend install-frontend
	@echo "$(GREEN)✓ All dependencies installed!$(NC)"

install-serveurapp:
	@echo "$(BLUE)Installing server backend dependencies...$(NC)"
	cd $(BACKEND_DIR) && npm install
	@echo "$(GREEN)✓ Server backend dependencies installed!$(NC)"

configure-env:
	@echo "$(BLUE)Setting up environment configuration...$(NC)"
	cd $(BACKEND_DIR) && node setup-env.js

setup-config: install-serveurapp configure-env
	@echo "$(GREEN)✓ Configuration complete!$(NC)"

install-backend:
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	cd $(BACKEND_DIR) && npm install
	@echo "$(GREEN)✓ Backend dependencies installed$(NC)"

install-frontend:
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)✓ Frontend dependencies installed$(NC)"

setup: install configure-env install-db
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  - Run: make dev (for development)"
	@echo "  - Or: make prod (for production)"

# ============================================================================
# DEVELOPMENT
# ============================================================================

dev: dev-backend dev-frontend
	@echo "$(GREEN)✓ Development servers started!$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"

dev-backend:
	@echo "$(BLUE)Starting backend development server...$(NC)"
	cd $(BACKEND_DIR) && npm run dev

dev-frontend:
	@echo "$(BLUE)Starting frontend development server...$(NC)"
	cd $(FRONTEND_DIR) && npm run dev

# ============================================================================
# PRODUCTION (Docker)
# ============================================================================

prod: docker-build start
	@echo "$(GREEN)✓ Production environment started!$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"
	@sleep 2 && make health-check

build: docker-build
	@echo "$(GREEN)✓ Build complete!$(NC)"

docker-build:
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ Docker images built!$(NC)"

start:
	@echo "$(BLUE)Starting containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Containers started!$(NC)"
	@echo "  Waiting for services to be ready..."
	@sleep 5

stop:
	@echo "$(BLUE)Stopping containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers stopped!$(NC)"

restart: stop start
	@echo "$(GREEN)✓ Containers restarted!$(NC)"

# ============================================================================
# DATABASE
# ============================================================================

install-db: db-init db-seed
	@echo "$(GREEN)✓ Database initialized and seeded with demo data!$(NC)"
	@echo "  Demo user: admin / admin123"

db-init:
	@echo "$(BLUE)Initializing database...$(NC)"
	@mkdir -p data
	cd $(BACKEND_DIR) && node init-db.js
	@echo "$(GREEN)✓ Database initialized!$(NC)"

db-seed:
	@echo "$(BLUE)Seeding database...$(NC)"
	cd $(BACKEND_DIR) && node seed-db.js
	@echo "$(GREEN)✓ Database seeded with demo data!$(NC)"
	@echo "  Demo user: admin / admin123"

db-reset:
	@echo "$(RED)⚠️  WARNING: This will delete all data!$(NC)"
	@read -p "Type 'yes' to confirm: " confirm && \
	[ "$$confirm" = "yes" ] && \
	rm -f data/labs.db && \
	make db-init && \
	make db-seed && \
	echo "$(GREEN)✓ Database reset complete!$(NC)" || \
	echo "$(YELLOW)Cancelled$(NC)"

# ============================================================================
# MAINTENANCE
# ============================================================================

logs:
	@echo "$(BLUE)Showing Docker logs (Ctrl+C to exit)...$(NC)"
	docker-compose logs -f

logs-api:
	@echo "$(BLUE)API logs:$(NC)"
	docker-compose logs -f api

logs-frontend:
	@echo "$(BLUE)Frontend logs:$(NC)"
	docker-compose logs -f frontend

test:
	@echo "$(BLUE)Running tests...$(NC)"
	cd $(BACKEND_DIR) && npm test 2>/dev/null || echo "$(YELLOW)No tests configured$(NC)"

lint:
	@echo "$(BLUE)Linting code...$(NC)"
	@cd $(BACKEND_DIR) && npm run lint 2>/dev/null || echo "$(YELLOW)No lint configured for backend$(NC)"
	@cd $(FRONTEND_DIR) && npm run lint 2>/dev/null || echo "$(YELLOW)No lint configured for frontend$(NC)"

clean: docker-clean
	@echo "$(BLUE)Cleaning up...$(NC)"
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .vite -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name dist -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete!$(NC)"

# ============================================================================
# DOCKER
# ============================================================================

docker-push:
	@echo "$(BLUE)Pushing images to registry...$(NC)"
	docker tag $(IMAGE_NAME)-api:latest $(DOCKER_REGISTRY)/$(IMAGE_NAME)-api:$(VERSION)
	docker tag $(IMAGE_NAME)-frontend:latest $(DOCKER_REGISTRY)/$(IMAGE_NAME)-frontend:$(VERSION)
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME)-api:$(VERSION)
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME)-frontend:$(VERSION)
	@echo "$(GREEN)✓ Images pushed!$(NC)"

docker-clean:
	@echo "$(BLUE)Cleaning Docker resources...$(NC)"
	docker-compose down -v
	docker system prune -f
	@echo "$(GREEN)✓ Docker cleanup complete!$(NC)"

# ============================================================================
# DEPLOYMENT
# ============================================================================

deploy: docker-build start db-init db-seed health-check
	@echo "$(GREEN)✓ Deployment complete!$(NC)"
	@echo ""
	@echo "$(BLUE)Application is ready:$(NC)"
	@echo "  🌐 Frontend: http://localhost:3000"
	@echo "  📡 Backend:  http://localhost:3001"
	@echo "  🔑 Demo:     admin / admin123"

health-check:
	@echo "$(BLUE)Checking system health...$(NC)"
	@sleep 2
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s -o /dev/null -w "  HTTP Status: %{http_code}\n" http://localhost:3000 || echo "  ❌ Frontend not responding"
	@echo "$(YELLOW)Backend:$(NC)"
	@curl -s -o /dev/null -w "  HTTP Status: %{http_code}\n" http://localhost:3001/api/health || echo "  ❌ Backend not responding"
	@echo ""
	@docker-compose ps
	@echo "$(GREEN)✓ Health check complete!$(NC)"

# ============================================================================
# QUICK COMMANDS
# ============================================================================

backup:
	@echo "$(BLUE)Creating database backup...$(NC)"
	@mkdir -p backups
	@cp data/labs.db backups/labs-$(shell date +%Y%m%d-%H%M%S).db
	@echo "$(GREEN)✓ Backup created in backups/$(NC)"

shell-api:
	@echo "$(BLUE)Opening backend shell...$(NC)"
	docker-compose exec api /bin/sh

shell-frontend:
	@echo "$(BLUE)Opening frontend shell...$(NC)"
	docker-compose exec frontend /bin/sh

version:
	@echo "$(BLUE)Ephemeral Labs v$(VERSION)$(NC)"
	@docker-compose version 2>/dev/null || echo "$(YELLOW)Docker Compose not installed$(NC)"

status:
	@echo "$(BLUE)System Status:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)Docker Stats:$(NC)"
	@docker stats --no-stream 2>/dev/null || echo "$(YELLOW)Docker not running$(NC)"

# ============================================================================
# INFO TARGETS
# ============================================================================

info:
	@echo "$(BLUE)Project Information:$(NC)"
	@echo "  Name: Ephemeral Labs"
	@echo "  Version: $(VERSION)"
	@echo "  Docker Registry: $(DOCKER_REGISTRY)"
	@echo ""
	@echo "$(BLUE)Directories:$(NC)"
	@echo "  Backend: $(BACKEND_DIR)"
	@echo "  Frontend: $(FRONTEND_DIR)"
	@echo ""
	@echo "$(BLUE)Services:$(NC)"
	@echo "  API: port 3001"
	@echo "  Frontend: port 3000"
	@echo "  Redis: port 6379"
	@echo ""
	@echo "$(BLUE)Database:$(NC)"
	@echo "  Type: SQLite"
	@echo "  Location: data/labs.db"

all: help

.DEFAULT_GOAL := help
