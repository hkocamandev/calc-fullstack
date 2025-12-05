package main

import (
	"calc-backend/handler"
	"calc-backend/middleware"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/calc", handler.CalcHandler)

	// Middleware order: Recovery -> Logging
	handlerWithMiddleware := middleware.Recovery(middleware.Logging(mux))

	log.Println("Server started at :8080")
	err := http.ListenAndServe(":8080", handlerWithMiddleware)
	if err != nil {
		log.Fatal(err)
	}
}
