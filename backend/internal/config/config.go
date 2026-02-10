package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv            string
	AppPort           string
	DBDSN             string
	JWTSecret         string
	JWTExpiresInHours int
	CORSAllowedOrigin string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	expires, err := strconv.Atoi(getEnv("JWT_EXPIRES_IN_HOURS", "24"))
	if err != nil {
		expires = 24
	}

	cfg := &Config{
		AppEnv:            getEnv("APP_ENV", "development"),
		AppPort:           getEnvAny([]string{"APP_PORT", "PORT"}, "8080"),
		DBDSN:             getEnvAny([]string{"DB_DSN", "DATABASE_URL"}, ""),
		JWTSecret:         getEnv("JWT_SECRET", "change-me"),
		JWTExpiresInHours: expires,
		CORSAllowedOrigin: getEnv("CORS_ALLOWED_ORIGIN", "http://localhost:3000"),
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func getEnvAny(keys []string, fallback string) string {
	for _, key := range keys {
		if value := os.Getenv(key); value != "" {
			return value
		}
	}
	return fallback
}
