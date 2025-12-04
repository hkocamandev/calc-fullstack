package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCalcHandlerXSSI(t *testing.T) {
	// Arrange
	req := httptest.NewRequest(http.MethodGet, "/calc?op=add&a=2&b=3", nil)
	w := httptest.NewRecorder()

	// Act
	CalcHandler(w, req)

	body := w.Body.String()

	// Assert
	xssiPrefix := ")]}',\n"
	if !strings.HasPrefix(body, xssiPrefix) {
		t.Fatalf("Expected XSSI prefix %q, but got: %q", xssiPrefix, body)
	}
}
