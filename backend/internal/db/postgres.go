package db

import (
	"personal-diary/backend/internal/config"
	"personal-diary/backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgres(cfg *config.Config) (*gorm.DB, error) {
	database, err := gorm.Open(postgres.Open(cfg.DBDSN), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := database.AutoMigrate(&models.User{}, &models.Entry{}); err != nil {
		return nil, err
	}

	return database, nil
}
