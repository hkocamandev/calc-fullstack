package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"calc-backend/model"
	"calc-backend/service"
	"calc-backend/util"
)

func CalcHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	op := r.URL.Query().Get("op")
	aStr := r.URL.Query().Get("a")
	bStr := r.URL.Query().Get("b")
	util.GetLogger().Info("User pressed: a=" + aStr + " b=" + bStr + " op=" + op)

	if op == "" {
		util.GetLogger().Error("Operation (op) is missing")
		util.HandleError(w, http.StatusBadRequest, "Operation (op) is missing")
		return
	}

	if aStr == "" {
		util.GetLogger().Error("First parameter is missing")
		util.HandleError(w, http.StatusBadRequest, "First parameter is missing")
		return
	}

	if op != "sqrt" && bStr == "" {
		util.GetLogger().Error("Second parameter is missing")
		util.HandleError(w, http.StatusBadRequest, "Second parameter is missing")
		return
	}

	a, err := strconv.ParseFloat(aStr, 64)
	if err != nil {
		util.GetLogger().Error("Invalid number A: " + aStr)
		util.HandleError(w, http.StatusBadRequest, "Invalid number A")
		return
	}

	var b float64
	if op != "sqrt" {
		b, err = strconv.ParseFloat(bStr, 64)
		if err != nil {
			util.GetLogger().Error("Invalid number B: " + bStr)
			util.HandleError(w, http.StatusBadRequest, "Invalid number B")
			return
		}
	}

	result, err := service.CalcService{}.Calculate(op, a, b)
	if err != nil {
		util.HandleError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(model.ResultResponse{Result: result})
}
