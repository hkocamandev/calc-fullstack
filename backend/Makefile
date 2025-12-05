# Go project tools
APP_NAME=calc-backend
COVERAGE_FILE=coverage.out
COVERAGE_HTML=coverage.html

.PHONY: test
test:
	@echo "=== Running all tests with coverage ==="
	go test ./... -cover -coverprofile=$(COVERAGE_FILE)
	go tool cover -func=$(COVERAGE_FILE)

.PHONY: cover
cover: test
	@echo "=== Generating HTML coverage report ==="
	go tool cover -html=$(COVERAGE_FILE) -o $(COVERAGE_HTML)
	@echo "Open file://$(PWD)/$(COVERAGE_HTML)"

.PHONY: lint
lint:
	@echo "=== Running golangci-lint ==="
	golangci-lint run

vet:
	@echo "=== Running go vet ==="
	go vet ./...

.PHONY: build
build:
	@echo "=== Building $(APP_NAME) ==="
	go build -o $(APP_NAME) main.go

.PHONY: run
run: build
	./$(APP_NAME)

.PHONY: clean
clean:
	@echo "Cleaning..."
	rm -f $(APP_NAME) $(COVERAGE_FILE) $(COVERAGE_HTML)
