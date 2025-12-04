package handler

import (
	"encoding/json"
	"fmt"
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
		return
	}

	op := r.URL.Query().Get("op")
	aStr := r.URL.Query().Get("a")
	bStr := r.URL.Query().Get("b")

	a, err := strconv.ParseFloat(aStr, 64)
	if op != "sqrt" && err != nil {
		errMsg := "Invalid number A"
		util.GetLogger().Error(errMsg) // Error log
		util.HandleError(w, http.StatusBadRequest, errMsg)
		return
	}

	var b float64
	if op != "sqrt" {
		b, err = strconv.ParseFloat(bStr, 64)
		if err != nil {
			errMsg := "Invalid number B"
			util.GetLogger().Error(errMsg) // Error log
			util.HandleError(w, http.StatusBadRequest, errMsg)
			return
		}
	}

	util.GetLogger().Info(fmt.Sprintf("User pressed: %s, a=%f, b=%f", op, a, b))

	result, err := service.CalcService{}.Calculate(op, a, b)
	if err != nil {
		util.GetLogger().Error(err.Error()) // Error log
		util.HandleError(w, http.StatusBadRequest, err.Error())
		return
	}

	json.NewEncoder(w).Encode(model.ResultResponse{Result: result})
}
