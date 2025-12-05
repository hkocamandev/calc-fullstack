package service

import (
	"calc-backend/util"
	"errors"
	"fmt"
	"math"
)

// Operation interface
type Operation interface {
	Execute(a, b float64) (float64, error)
}

// Concrete operations
type AddOp struct{}

func (AddOp) Execute(a, b float64) (float64, error) { return a + b, nil }

type SubOp struct{}

func (SubOp) Execute(a, b float64) (float64, error) { return a - b, nil }

type MulOp struct{}

func (MulOp) Execute(a, b float64) (float64, error) { return a * b, nil }

type DivOp struct{}

func (DivOp) Execute(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("cannot divide by zero")
	}
	return a / b, nil
}

type PowOp struct{}

func (PowOp) Execute(a, b float64) (float64, error) { return math.Pow(a, b), nil }

type SqrtOp struct{}

func (SqrtOp) Execute(a, b float64) (float64, error) {
	if a < 0 {
		return 0, errors.New("cannot take sqrt of negative number")
	}
	return math.Sqrt(a), nil
}

type PercentOp struct{}

func (PercentOp) Execute(a, b float64) (float64, error) { return (a * b) / 100, nil }

// Factory
type OperationFactory struct{}

func (f OperationFactory) GetOperation(op string) (Operation, error) {
	switch op {
	case "add":
		return AddOp{}, nil
	case "sub":
		return SubOp{}, nil
	case "mul":
		return MulOp{}, nil
	case "div":
		return DivOp{}, nil
	case "pow", "x²":
		return PowOp{}, nil
	case "sqrt", "√":
		return SqrtOp{}, nil
	case "percent", "%":
		return PercentOp{}, nil
	default:
		return nil, errors.New("unknown operation")
	}
}

// Service
type CalcService struct{}

func (s CalcService) Calculate(op string, a, b float64) (float64, error) {
	operation, err := OperationFactory{}.GetOperation(op)
	if err != nil {
		util.GetLogger().Error(fmt.Sprintf("Unknown operation: %s a=%v b=%v err=%v", op, a, b, err))
		return 0, err
	}

	result, err := operation.Execute(a, b)
	if err != nil {
		util.GetLogger().Error(fmt.Sprintf("Calculation error: op=%s a=%v b=%v err=%v", op, a, b, err))
		return 0, err
	}

	// Başarılı işlem logu
	util.GetLogger().Info(fmt.Sprintf("Calculation success: op=%s a=%v b=%v result=%v", op, a, b, result))
	return result, nil
}
