package service

import (
	"errors"
	"math"
	"sort"
	"strings"
	"time"

	"personal-diary/backend/internal/models"
	"personal-diary/backend/internal/repository"
)

type EntryService struct {
	repo *repository.EntryRepository
}

type MoodAnalytics struct {
	PeriodDays      int            `json:"periodDays"`
	TotalEntries    int            `json:"totalEntries"`
	MoodCounts      map[string]int `json:"moodCounts"`
	DominantMood    string         `json:"dominantMood"`
	CurrentScore    float64        `json:"currentScore"`
	PreviousScore   float64        `json:"previousScore"`
	Trend           string         `json:"trend"`
}

type DailyPrompt struct {
	Date   string `json:"date"`
	Prompt string `json:"prompt"`
}

type MemoryLaneItem struct {
	ID        uint      `json:"id"`
	Title     string    `json:"title"`
	Mood      string    `json:"mood"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
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

func (s *EntryService) MoodAnalytics(userID uint) (*MoodAnalytics, error) {
	now := time.Now().UTC()
	currentStart := now.AddDate(0, 0, -30)
	previousStart := now.AddDate(0, 0, -60)

	currentEntries, err := s.repo.ListByUserBetween(userID, currentStart, now)
	if err != nil {
		return nil, err
	}
	previousEntries, err := s.repo.ListByUserBetween(userID, previousStart, currentStart)
	if err != nil {
		return nil, err
	}

	counts := map[string]int{}
	for _, e := range currentEntries {
		m := normalizedMood(e.Mood)
		counts[m]++
	}

	dominant := "neutral"
	maxCount := 0
	for mood, c := range counts {
		if c > maxCount {
			maxCount = c
			dominant = mood
		}
	}

	currentScore := averageMoodScore(currentEntries)
	previousScore := averageMoodScore(previousEntries)
	trend := "stable"
	if currentScore > previousScore+0.15 {
		trend = "improving"
	} else if currentScore < previousScore-0.15 {
		trend = "declining"
	}

	return &MoodAnalytics{
		PeriodDays:    30,
		TotalEntries:  len(currentEntries),
		MoodCounts:    counts,
		DominantMood:  dominant,
		CurrentScore:  currentScore,
		PreviousScore: previousScore,
		Trend:         trend,
	}, nil
}

func (s *EntryService) DailyPrompt(userID uint) DailyPrompt {
	today := time.Now().UTC()
	prompts := []string{
		"What happened today that you want to thank yourself for?",
		"What felt heavy today, and what made it lighter?",
		"What did your body need today that you can honor tomorrow?",
		"Write one moment today that deserved more credit.",
		"If today had a color, what would it be and why?",
		"What are you carrying right now that you can put down for tonight?",
		"Who showed up for you today, even in a small way?",
	}
	index := (int(userID) + today.YearDay()) % len(prompts)
	return DailyPrompt{
		Date:   today.Format("2006-01-02"),
		Prompt: prompts[index],
	}
}

func (s *EntryService) MemoryLane(userID uint) ([]MemoryLaneItem, error) {
	now := time.Now().UTC()
	entries, err := s.repo.ListMemoryLaneByUser(userID, int(now.Month()), now.Day(), now.Year())
	if err != nil {
		return nil, err
	}
	result := make([]MemoryLaneItem, 0, len(entries))
	for _, e := range entries {
		result = append(result, MemoryLaneItem{
			ID:        e.ID,
			Title:     e.Title,
			Mood:      e.Mood,
			Content:   e.Content,
			CreatedAt: e.CreatedAt,
		})
	}
	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})
	if len(result) > 5 {
		result = result[:5]
	}
	return result, nil
}

func normalizedMood(m string) string {
	v := strings.TrimSpace(strings.ToLower(m))
	if v == "" {
		return "neutral"
	}
	return v
}

func averageMoodScore(entries []models.Entry) float64 {
	if len(entries) == 0 {
		return 0
	}
	scores := map[string]float64{
		"happy":   1.0,
		"calm":    0.8,
		"focused": 0.6,
		"neutral": 0.5,
		"tired":   0.3,
		"anxious": 0.1,
	}
	var total float64
	for _, e := range entries {
		m := normalizedMood(e.Mood)
		if score, ok := scores[m]; ok {
			total += score
		} else {
			total += scores["neutral"]
		}
	}
	value := total / float64(len(entries))
	return math.Round(value*100) / 100
}
