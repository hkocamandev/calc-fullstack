package util

import (
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestHandleError(t *testing.T) {
	rr := httptest.NewRecorder()

	HandleError(rr, 400, "bad request")

	if rr.Code != 400 {
		t.Errorf("expected status 400, got %d", rr.Code)
	}

	body := rr.Body.String()

	// JSON decode check
	var m map[string]string
	if err := json.Unmarshal([]byte(body), &m); err != nil { // artık body[6:] değil, body direkt
		t.Fatalf("failed to unmarshal JSON: %v", err)
	}

	if m["error"] != "bad request" {
		t.Errorf("expected error 'bad request', got %s", m["error"])
	}
}

func TestLoggerSingleton(t *testing.T) {
	l1 := GetLogger()
	l2 := GetLogger()

	if l1 != l2 {
		t.Errorf("expected same logger instance (singleton)")
	}
}

func TestLoggerMethods(t *testing.T) {
	l := GetLogger()

	// Sadece çalıştığını test ediyoruz, çıktı kontrolü yok
	l.Info("test info")
	l.Error("test error")
}
