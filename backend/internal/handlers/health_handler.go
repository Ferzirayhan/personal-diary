package handlers

import (
	"net/http"

	"personal-diary/backend/pkg/httpx"
)

func Health(w http.ResponseWriter, _ *http.Request) {
	httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
