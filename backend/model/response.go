package model

type ErrorResponse struct {
	Error string `json:"error"`
}

type ResultResponse struct {
	Result float64 `json:"result"`
}
