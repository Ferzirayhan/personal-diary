package repository

import (
	"personal-diary/backend/internal/models"

	"gorm.io/gorm"
)

type EntryRepository struct {
	db *gorm.DB
}

func NewEntryRepository(db *gorm.DB) *EntryRepository {
	return &EntryRepository{db: db}
}

func (r *EntryRepository) Create(entry *models.Entry) error {
	return r.db.Create(entry).Error
}

func (r *EntryRepository) ListByUser(userID uint) ([]models.Entry, error) {
	var entries []models.Entry
	err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&entries).Error
	return entries, err
}

func (r *EntryRepository) FindByIDAndUser(id, userID uint) (*models.Entry, error) {
	var entry models.Entry
	if err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&entry).Error; err != nil {
		return nil, err
	}
	return &entry, nil
}

func (r *EntryRepository) Update(entry *models.Entry) error {
	return r.db.Save(entry).Error
}

func (r *EntryRepository) Delete(entry *models.Entry) error {
	return r.db.Delete(entry).Error
}
