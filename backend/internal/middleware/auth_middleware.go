package middleware

import (
	"context"
	"net/http"
	"strings"

	"personal-diary/backend/internal/config"
	"personal-diary/backend/pkg/auth"
	"personal-diary/backend/pkg/httpx"
)

type contextKey string

const userIDContextKey contextKey = "userID"

func Auth(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				httpx.Error(w, http.StatusUnauthorized, "missing authorization header")
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				httpx.Error(w, http.StatusUnauthorized, "invalid authorization format")
				return
			}

			claims, err := auth.ParseToken(cfg.JWTSecret, parts[1])
			if err != nil {
				httpx.Error(w, http.StatusUnauthorized, "invalid token")
				return
			}

			ctx := context.WithValue(r.Context(), userIDContextKey, claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func UserIDFromContext(ctx context.Context) uint {
	if userID, ok := ctx.Value(userIDContextKey).(uint); ok {
		return userID
	}
	return 0
}
