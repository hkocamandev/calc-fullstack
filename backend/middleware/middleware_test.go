package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// Helper: dummy next handler
func nextHandler(status int) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(status)
	})
}

func TestLoggingMiddleware(t *testing.T) {
	req := httptest.NewRequest("GET", "/test", nil)
	rr := httptest.NewRecorder()

	handler := Logging(nextHandler(200))
	handler.ServeHTTP(rr, req)

	if rr.Code != 200 {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}

func TestRecoveryMiddleware_NoPanic(t *testing.T) {
	req := httptest.NewRequest("GET", "/ok", nil)
	rr := httptest.NewRecorder()

	handler := Recovery(nextHandler(200))
	handler.ServeHTTP(rr, req)

	if rr.Code != 200 {
		t.Errorf("expected 200, got %d", rr.Code)
	}
}

func TestRecoveryMiddleware_WithPanic(t *testing.T) {
	req := httptest.NewRequest("GET", "/panic", nil)
	rr := httptest.NewRecorder()

	panicHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("boom")
	})

	handler := Recovery(panicHandler)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", rr.Code)
	}

	if !strings.Contains(rr.Body.String(), "Internal Server Error") {
		t.Errorf("expected Internal Server Error body, got %s", rr.Body.String())
	}
}
