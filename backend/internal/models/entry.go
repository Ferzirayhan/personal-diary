package models

import "time"

type Entry struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"userId"`
	Title     string    `gorm:"size:255;not null" json:"title"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	Mood      string    `gorm:"size:40" json:"mood"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
