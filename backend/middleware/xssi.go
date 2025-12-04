package middleware

import (
	"net/http"
)

func XSSIMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// JSON header
		w.Header().Set("Content-Type", "application/json")
		// XSSI prevention with prefix
		w.Write([]byte(")]}',\n"))
		next.ServeHTTP(w, r)
	})
}
