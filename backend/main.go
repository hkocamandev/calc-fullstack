package main

import (
	"encoding/json"
	"net/http"
	"strconv"
)

func addHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// OPTIONS isteği gelirse sadece CORS cevapla
	if r.Method == http.MethodOptions {
		return
	}
	aStr := r.URL.Query().Get("a")
	bStr := r.URL.Query().Get("b")

	a, err1 := strconv.ParseFloat(aStr, 64)
	b, err2 := strconv.ParseFloat(bStr, 64)

	if err1 != nil || err2 != nil {
		http.Error(w, "Invalid number", http.StatusBadRequest)
		return
	}

	result := a + b

	json.NewEncoder(w).Encode(map[string]any{
		"result": result,
	})
}

func main() {
	http.HandleFunc("/add", addHandler)
	http.ListenAndServe(":8080", nil)
}
