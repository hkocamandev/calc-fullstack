package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// Helper: calls handler through a mux wrapped with middleware to mimic main.go path
func callThroughMux(t *testing.T, rawURL string) *httptest.ResponseRecorder {
	t.Helper()
	mux := http.NewServeMux()
	mux.HandleFunc("/calc", CalcHandler)

	handlerWithMiddleware := mux

	req := httptest.NewRequest(http.MethodGet, rawURL, nil)
	w := httptest.NewRecorder()
	handlerWithMiddleware.ServeHTTP(w, req)
	return w
}

func TestCalcHandler_Add_Success(t *testing.T) {
	w := callThroughMux(t, "/calc?op=add&a=2&b=3")
	body := w.Body.String()

	if !strings.Contains(body, "\"result\":5") {
		t.Fatalf("Expected result in body, got: %q", body)
	}
	if w.Result().StatusCode != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", w.Result().StatusCode)
	}
}

func TestCalcHandler_DivideByZero_Error(t *testing.T) {
	w := callThroughMux(t, "/calc?op=div&a=5&b=0")
	body := w.Body.String()

	// Check status code 400
	if w.Result().StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400 status for divide by zero, got %d", w.Result().StatusCode)
	}
	// Check that body contains the error message
	if !strings.Contains(body, "cannot divide by zero") {
		t.Fatalf("expected divide by zero error in body, got: %q", body)
	}

}
