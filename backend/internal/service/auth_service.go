package service

import (
	"errors"
	"strings"

	"personal-diary/backend/internal/config"
	"personal-diary/backend/internal/models"
	"personal-diary/backend/internal/repository"
	"personal-diary/backend/pkg/auth"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	cfg      *config.Config
	userRepo *repository.UserRepository
}

func NewAuthService(cfg *config.Config, userRepo *repository.UserRepository) *AuthService {
	return &AuthService{cfg: cfg, userRepo: userRepo}
}

func (s *AuthService) Signup(name, email, password string) (*models.User, string, error) {
	email = strings.ToLower(strings.TrimSpace(email))
	if name == "" || email == "" || password == "" {
		return nil, "", errors.New("name, email, and password are required")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", err
	}

	user := &models.User{Name: strings.TrimSpace(name), Email: email, Password: string(hashed)}
	if err := s.userRepo.Create(user); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") {
			return nil, "", errors.New("email already registered")
		}
		return nil, "", err
	}

	token, err := auth.GenerateToken(s.cfg.JWTSecret, user.ID, s.cfg.JWTExpiresInHours)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *AuthService) Login(email, password string) (*models.User, string, error) {
	user, err := s.userRepo.FindByEmail(strings.ToLower(strings.TrimSpace(email)))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", errors.New("invalid credentials")
		}
		return nil, "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	token, err := auth.GenerateToken(s.cfg.JWTSecret, user.ID, s.cfg.JWTExpiresInHours)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}
