package main

import (
	"encoding/json"
	"math"
	"net/http"
	"strconv"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

type ResultResponse struct {
	Result float64 `json:"result"`
}

func calcHandler(w http.ResponseWriter, r *http.Request) {
	// CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	op := r.URL.Query().Get("op")
	aStr := r.URL.Query().Get("a")
	bStr := r.URL.Query().Get("b")

	// Parse a
	a, err1 := strconv.ParseFloat(aStr, 64)
	if op != "sqrt" && err1 != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid number A"})
		return
	}

	// Parse b if needed
	var b float64
	var err2 error
	if op != "sqrt" { // sqrt sadece A'yı kullanır
		b, err2 = strconv.ParseFloat(bStr, 64)
		if err2 != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid number B"})
			return
		}
	}

	var result float64

	switch op {
	case "add":
		result = a + b
	case "sub":
		result = a - b
	case "mul":
		result = a * b
	case "div":
		if b == 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Cannot divide by zero"})
			return
		}
		result = a / b
	case "pow":
		result = math.Pow(a, b)
	case "sqrt":
		if a < 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Cannot take sqrt of negative number"})
			return
		}
		result = math.Sqrt(a)
	case "percent":
		result = (a * b) / 100
	default:
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Unknown operation"})
		return
	}

	json.NewEncoder(w).Encode(ResultResponse{Result: result})
}

func main() {
	http.HandleFunc("/calc", calcHandler)
	http.ListenAndServe(":8080", nil)
}
