package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"personal-diary/backend/internal/middleware"
	"personal-diary/backend/internal/service"
	"personal-diary/backend/pkg/httpx"
	"gorm.io/gorm"
)

type EntryHandler struct {
	service *service.EntryService
}

func NewEntryHandler(service *service.EntryService) *EntryHandler {
	return &EntryHandler{service: service}
}

type entryRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Mood    string `json:"mood"`
}

func (h *EntryHandler) List(w http.ResponseWriter, r *http.Request) {
	entries, err := h.service.List(middleware.UserIDFromContext(r.Context()))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to load entries")
		return
	}
	httpx.JSON(w, http.StatusOK, entries)
}

func (h *EntryHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req entryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid payload")
		return
	}

	entry, err := h.service.Create(middleware.UserIDFromContext(r.Context()), req.Title, req.Content, req.Mood)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, entry)
}

func (h *EntryHandler) Get(w http.ResponseWriter, r *http.Request) {
	entryID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid entry id")
		return
	}

	entry, err := h.service.Get(middleware.UserIDFromContext(r.Context()), uint(entryID))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			httpx.Error(w, http.StatusNotFound, "entry not found")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "failed to load entry")
		return
	}
	httpx.JSON(w, http.StatusOK, entry)
}

func (h *EntryHandler) Update(w http.ResponseWriter, r *http.Request) {
	entryID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid entry id")
		return
	}

	var req entryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid payload")
		return
	}

	entry, err := h.service.Update(middleware.UserIDFromContext(r.Context()), uint(entryID), req.Title, req.Content, req.Mood)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			httpx.Error(w, http.StatusNotFound, "entry not found")
			return
		}
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, entry)
}

func (h *EntryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	entryID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid entry id")
		return
	}

	if err := h.service.Delete(middleware.UserIDFromContext(r.Context()), uint(entryID)); err != nil {
		if err == gorm.ErrRecordNotFound {
			httpx.Error(w, http.StatusNotFound, "entry not found")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "failed to delete entry")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
