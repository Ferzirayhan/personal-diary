package models

import "time"

type Entry struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	UserID           uint      `gorm:"not null;index" json:"userId"`
	Title            string    `gorm:"size:255;not null" json:"title"`
	OneLine          string    `gorm:"size:255" json:"oneLine"`
	Content          string    `gorm:"type:text;not null" json:"content"`
	Mood             string    `gorm:"size:40" json:"mood"`
	SomeoneWasThere  bool      `gorm:"default:false" json:"someoneWasThere"`
	SomeoneCareNote  string    `gorm:"size:500" json:"someoneCareNote"`
	QuietGratitude   string    `gorm:"type:text" json:"quietGratitude"`
	CloseTheDay      bool      `gorm:"default:false" json:"closeTheDay"`
	Locked           bool      `gorm:"default:false;index" json:"locked"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}
