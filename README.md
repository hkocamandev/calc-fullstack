# Full-Stack Calculator Application

## Objective
Build a full-stack calculator application with a React frontend and a Go backend microservice. The frontend consumes the backend API to perform basic and advanced arithmetic operations.

## Features
- Basic operations: Addition, Subtraction, Multiplication, Division
- Optional operations (implemented in backend service): Exponentiation, Square Root, Percentage
- **SCI toggle button** implemented for vertical ↔ horizontal layout switch.  
  *Currently only switches layout horizontally; SCI operation buttons in horizontal mode are placeholders for future implementation.*
- Input validation and error handling in backend
- Responsive frontend design

## Project Structure

- calc-fullstack/
  - backend/
    - handler/
      - calc_handler.go
    - service/
      - calc_service.go
    - model/
      - response.go
    - util/
      - error_handler.go
      - logger.go
    - main.go
    - Dockerfile          # Backend Dockerfile
  - frontend/
    - src/
      - ... (React components, hooks, etc.)
    - package.json
    - frontend/Dockerfile # Frontend Dockerfile
  - docker-compose.yml
  - Makefile

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js (v20 recommended)
- Go (>=1.25.5)
### Setup Instructions

*Step 1: Clone the repository*
```
git clone <this-repo-link>
cd calc-fullstack
```

*Step 2-a: Running Locally without Docker*

#### Backend
```
cd backend
go build -o calc-backend main.go
./calc-backend
```
#### Frontend
```
cd frontend
npm install
npm start
```

*Step 2-b: Running with Docker*
From project root:
```
make docker-up
Stop containers:
make docker-down
```

## API Usage
### Calculator Endpoint
```
GET /calc?op=<operation>&a=<number>&b=<number>
Parameters
op: Operation (add, sub, mul, div, pow, sqrt, percent)

a: First operand (required)

b: Second operand (required unless op is sqrt)

```

```

Successful Request

GET http://localhost:8080/calc?op=add&a=5&b=3
Response:
{
  "result": 8
}
```
```
Error Response

GET http://localhost:8080/calc?op=div&a=5&b=0
Response:
{
  "error": "cannot divide by zero"
}

```
Supported operations: add, sub, mul, div, pow, sqrt, percent.
## Testing

### Backend
- All backend functionality is covered with unit tests.
- Run tests:
  make backend-test
```
cd backend
go test ./... -cover -coverprofile=coverage.out
go tool cover -func=coverage.out
open coverage.html
```
### Frontend
Frontend unit tests are planned for future release.

## Design Decisions / Notes
Backend structured as a simple microservice with handler-service-model-util separation.

Operations implemented via Factory + Strategy design pattern for easy extensibility.

SCI toggle currently only changes layout orientation; horizontal SCI operation buttons are not functional yet (future feature).

Focused on maintainable, testable, and clean architecture.

Makefile provides unified commands for running, testing, linting, building, and Docker orchestration.

Backend coverage files coverage.out and coverage.html are included under /backend and can be opened in a browser

## Future Improvements
Implement full SCI functionality for horizontal layout

Add frontend unit tests

Enhance responsive styling for more device sizes

Extend backend operations if needed

## Prompts Used
The project was developed using AI assistance. Example prompt patterns included:

Backend (Go): "Generate a Go REST API for a calculator supporting add, sub, mul, div, pow, sqrt, percent operations with proper input validation, logging, and error handling."

Frontend (React): "Generate a React frontend in TypeScript that calls a backend calculator API and displays results with a responsive layout. Include SCI toggle button for vertical ↔ horizontal layout."

Testing: "Generate unit tests for Go backend calculator service covering all operations and error cases."

Docker: "Generate Dockerfile and docker-compose setup to run frontend and backend together in containers."
