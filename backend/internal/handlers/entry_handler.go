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
	Title           string `json:"title"`
	OneLine         string `json:"oneLine"`
	Content         string `json:"content"`
	Mood            string `json:"mood"`
	SomeoneWasThere bool   `json:"someoneWasThere"`
	SomeoneCareNote string `json:"someoneCareNote"`
	QuietGratitude  string `json:"quietGratitude"`
	CloseTheDay     bool   `json:"closeTheDay"`
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

	entry, err := h.service.Create(middleware.UserIDFromContext(r.Context()), service.EntryInput{
		Title:           req.Title,
		OneLine:         req.OneLine,
		Content:         req.Content,
		Mood:            req.Mood,
		SomeoneWasThere: req.SomeoneWasThere,
		SomeoneCareNote: req.SomeoneCareNote,
		QuietGratitude:  req.QuietGratitude,
		CloseTheDay:     req.CloseTheDay,
	})
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

	entry, err := h.service.Update(middleware.UserIDFromContext(r.Context()), uint(entryID), service.EntryInput{
		Title:           req.Title,
		OneLine:         req.OneLine,
		Content:         req.Content,
		Mood:            req.Mood,
		SomeoneWasThere: req.SomeoneWasThere,
		SomeoneCareNote: req.SomeoneCareNote,
		QuietGratitude:  req.QuietGratitude,
		CloseTheDay:     req.CloseTheDay,
	})
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
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *EntryHandler) Lock(w http.ResponseWriter, r *http.Request) {
	h.setLock(w, r, true)
}

func (h *EntryHandler) Unlock(w http.ResponseWriter, r *http.Request) {
	h.setLock(w, r, false)
}

func (h *EntryHandler) setLock(w http.ResponseWriter, r *http.Request, locked bool) {
	entryID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid entry id")
		return
	}
	entry, err := h.service.SetLock(middleware.UserIDFromContext(r.Context()), uint(entryID), locked)
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

func (h *EntryHandler) MoodAnalytics(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.MoodAnalytics(middleware.UserIDFromContext(r.Context()))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to calculate mood analytics")
		return
	}
	httpx.JSON(w, http.StatusOK, data)
}

func (h *EntryHandler) MemoryLane(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.MemoryLane(middleware.UserIDFromContext(r.Context()))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to load memory lane")
		return
	}
	httpx.JSON(w, http.StatusOK, data)
}

func (h *EntryHandler) OldEntryPeek(w http.ResponseWriter, r *http.Request) {
	data, err := h.service.OldEntryPeek(middleware.UserIDFromContext(r.Context()))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "failed to load old entry")
		return
	}
	if data == nil {
		httpx.JSON(w, http.StatusOK, map[string]any{"item": nil})
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"item": data})
}
