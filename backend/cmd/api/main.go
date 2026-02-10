package main

import (
	"fmt"
	"log"
	"net/http"

	"personal-diary/backend/internal/config"
	"personal-diary/backend/internal/db"
	"personal-diary/backend/internal/transport"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	database, err := db.NewPostgres(cfg)
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	router := transport.NewRouter(cfg, database)
	addr := fmt.Sprintf(":%s", cfg.AppPort)
	log.Printf("server running on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("server shutdown: %v", err)
	}
}
