package service

import (
	"math"
	"testing"
)

func almostEqual(a, b, eps float64) bool {
	if math.IsNaN(a) || math.IsNaN(b) {
		return false
	}
	return math.Abs(a-b) <= eps
}

func TestCalcService_Calculate(t *testing.T) {
	svc := CalcService{}

	tests := []struct {
		name    string
		op      string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"add", "add", 2, 3, 5, false},
		{"sub", "sub", 5, 2, 3, false},
		{"mul", "mul", 4, 3, 12, false},
		{"div", "div", 10, 2, 5, false},
		{"div by zero", "div", 5, 0, 0, true},
		{"pow", "pow", 2, 3, 8, false},
		{"sqrt", "sqrt", 9, 0, 3, false},
		{"sqrt negative", "sqrt", -4, 0, 0, true},
		{"percent", "percent", 50, 10, 5, false}, // 50 * 10 / 100 = 5
		{"unknown", "nope", 1, 2, 0, true},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			got, err := svc.Calculate(tc.op, tc.a, tc.b)
			if tc.wantErr {
				if err == nil {
					t.Fatalf("expected error but got none (op=%s)", tc.op)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if !almostEqual(got, tc.want, 1e-9) {
				t.Fatalf("got=%v want=%v", got, tc.want)
			}
		})
	}
}
