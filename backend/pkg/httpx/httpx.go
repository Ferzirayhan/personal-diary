package httpx

import (
	"encoding/json"
	"net/http"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

func JSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func Error(w http.ResponseWriter, status int, message string) {
	JSON(w, status, ErrorResponse{Message: message})
}
