# backend/Dockerfile
FROM golang:1.25.5-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o calc-backend main.go

EXPOSE 8080

CMD ["./calc-backend"]

