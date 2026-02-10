package repository

import (
	"personal-diary/backend/internal/models"
	"time"

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

func (r *EntryRepository) ListByUserBetween(userID uint, start, end time.Time) ([]models.Entry, error) {
	var entries []models.Entry
	err := r.db.
		Where("user_id = ? AND created_at >= ? AND created_at < ?", userID, start, end).
		Order("created_at desc").
		Find(&entries).Error
	return entries, err
}

func (r *EntryRepository) ListMemoryLaneByUser(userID uint, month, day int, currentYear int) ([]models.Entry, error) {
	var entries []models.Entry
	err := r.db.
		Where("user_id = ?", userID).
		Where("EXTRACT(MONTH FROM created_at) = ? AND EXTRACT(DAY FROM created_at) = ?", month, day).
		Where("EXTRACT(YEAR FROM created_at) < ?", currentYear).
		Order("created_at desc").
		Find(&entries).Error
	return entries, err
}

func (r *EntryRepository) RandomOldEntryByUser(userID uint, before time.Time) (*models.Entry, error) {
	var entry models.Entry
	if err := r.db.
		Where("user_id = ? AND created_at < ?", userID, before).
		Order("RANDOM()").
		First(&entry).Error; err != nil {
		return nil, err
	}
	return &entry, nil
}

func (r *EntryRepository) SetLocked(entry *models.Entry, locked bool) error {
	entry.Locked = locked
	return r.db.Save(entry).Error
}
