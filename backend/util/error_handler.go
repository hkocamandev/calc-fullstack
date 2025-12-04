package util

import (
	"encoding/json"
	"net/http"
)

func HandleError(w http.ResponseWriter, status int, message string) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
