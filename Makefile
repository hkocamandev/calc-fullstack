# ==============================
# Project Configuration
# ==============================
APP_NAME=calc-backend
BACKEND_DIR=backend
FRONTEND_DIR=frontend
COVERAGE_FILE=coverage.out
COVERAGE_HTML=coverage.html

# ==============================
# Backend Commands
# ==============================
.PHONY: backend-test
backend-test:
	@echo "=== Running Backend Tests ==="
	cd $(BACKEND_DIR) && go test ./... -cover -coverprofile=$(COVERAGE_FILE)
	cd $(BACKEND_DIR) && go tool cover -func=$(COVERAGE_FILE)

.PHONY: backend-build
backend-build:
	@echo "=== Building Backend ==="
	cd $(BACKEND_DIR) && go build -o $(APP_NAME) main.go

.PHONY: backend-run
backend-run: backend-build
	@echo "=== Running Backend ==="
	cd $(BACKEND_DIR) && ./$(APP_NAME)

# ==============================
# Frontend Commands
# ==============================
.PHONY: frontend-install
frontend-install:
	@echo "=== Installing Frontend Dependencies ==="
	cd $(FRONTEND_DIR) && npm install

.PHONY: frontend-build
frontend-build: frontend-install
	@echo "=== Building Frontend ==="
	cd $(FRONTEND_DIR) && npm run build

.PHONY: frontend-run
frontend-run:
	@echo "=== Running Frontend Dev Server ==="
	cd $(FRONTEND_DIR) && npm start

# ==============================
# Docker Commands
# ==============================
.PHONY: docker-build
docker-build:
	@echo "=== Building Docker Images ==="
	docker-compose build

.PHONY: docker-up
docker-up: docker-build
	@echo "=== Starting Docker Containers ==="
	docker-compose up

.PHONY: docker-down
docker-down:
	@echo "=== Stopping Docker Containers ==="
	docker-compose down

# ==============================
# Utility Commands
# ==============================
.PHONY: lint
lint:
	@echo "=== Running Go Lint ==="
	cd $(BACKEND_DIR) && golangci-lint run

.PHONY: vet
vet:
	@echo "=== Running go vet ==="
	cd $(BACKEND_DIR) && go vet ./...

.PHONY: clean
clean:
	@echo "=== Cleaning Project ==="
	cd $(BACKEND_DIR) && rm -f $(APP_NAME) $(COVERAGE_FILE) $(COVERAGE_HTML)
	cd $(FRONTEND_DIR) && rm -rf node_modules build
