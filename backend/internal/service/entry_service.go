package service

import (
	"errors"
	"strings"

	"personal-diary/backend/internal/models"
	"personal-diary/backend/internal/repository"
)

type EntryService struct {
	repo *repository.EntryRepository
}

func NewEntryService(repo *repository.EntryRepository) *EntryService {
	return &EntryService{repo: repo}
}

func (s *EntryService) Create(userID uint, title, content, mood string) (*models.Entry, error) {
	if strings.TrimSpace(title) == "" || strings.TrimSpace(content) == "" {
		return nil, errors.New("title and content are required")
	}
	entry := &models.Entry{UserID: userID, Title: strings.TrimSpace(title), Content: content, Mood: strings.TrimSpace(mood)}
	if err := s.repo.Create(entry); err != nil {
		return nil, err
	}
	return entry, nil
}

func (s *EntryService) List(userID uint) ([]models.Entry, error) {
	return s.repo.ListByUser(userID)
}

func (s *EntryService) Update(userID, entryID uint, title, content, mood string) (*models.Entry, error) {
	entry, err := s.repo.FindByIDAndUser(entryID, userID)
	if err != nil {
		return nil, err
	}
	if strings.TrimSpace(title) == "" || strings.TrimSpace(content) == "" {
		return nil, errors.New("title and content are required")
	}
	entry.Title = strings.TrimSpace(title)
	entry.Content = content
	entry.Mood = strings.TrimSpace(mood)
	if err := s.repo.Update(entry); err != nil {
		return nil, err
	}
	return entry, nil
}

func (s *EntryService) Delete(userID, entryID uint) error {
	entry, err := s.repo.FindByIDAndUser(entryID, userID)
	if err != nil {
		return err
	}
	return s.repo.Delete(entry)
}

func (s *EntryService) Get(userID, entryID uint) (*models.Entry, error) {
	return s.repo.FindByIDAndUser(entryID, userID)
}
