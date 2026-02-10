package transport

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"gorm.io/gorm"

	"personal-diary/backend/internal/config"
	"personal-diary/backend/internal/handlers"
	appMiddleware "personal-diary/backend/internal/middleware"
	"personal-diary/backend/internal/repository"
	"personal-diary/backend/internal/service"
	"personal-diary/backend/pkg/httpx"
)

func NewRouter(cfg *config.Config, database *gorm.DB) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors(cfg.CORSAllowedOrigin))

	userRepo := repository.NewUserRepository(database)
	entryRepo := repository.NewEntryRepository(database)
	authService := service.NewAuthService(cfg, userRepo)
	entryService := service.NewEntryService(entryRepo)
	authHandler := handlers.NewAuthHandler(authService)
	entryHandler := handlers.NewEntryHandler(entryService)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		httpx.JSON(w, http.StatusOK, map[string]string{"message": "Personal Diary API", "status": "running"})
	})
	r.Get("/health", handlers.Health)

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", authHandler.Signup)
			r.Post("/login", authHandler.Login)
		})

		r.Group(func(r chi.Router) {
			r.Use(appMiddleware.Auth(cfg))
			r.Get("/entries", entryHandler.List)
			r.Post("/entries", entryHandler.Create)
			r.Get("/entries/{id}", entryHandler.Get)
			r.Put("/entries/{id}", entryHandler.Update)
			r.Delete("/entries/{id}", entryHandler.Delete)
		})
	})

	return r
}

func cors(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			// Allow config origin OR any localhost/127.0.0.1 for dev convenience
			if origin == allowedOrigin || len(origin) == 0 || (len(origin) >= 16 && origin[:16] == "http://localhost") || (len(origin) >= 16 && origin[:16] == "http://127.0.0.1") {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			}
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Credentials", "true")

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
