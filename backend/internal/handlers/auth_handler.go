package handlers

import (
	"encoding/json"
	"net/http"

	"personal-diary/backend/internal/service"
	"personal-diary/backend/pkg/httpx"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type signupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	Token string      `json:"token"`
	User  interface{} `json:"user"`
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var req signupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid payload")
		return
	}

	user, token, err := h.authService.Signup(req.Name, req.Email, req.Password)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	httpx.JSON(w, http.StatusCreated, authResponse{Token: token, User: user})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid payload")
		return
	}

	user, token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, err.Error())
		return
	}

	httpx.JSON(w, http.StatusOK, authResponse{Token: token, User: user})
}
