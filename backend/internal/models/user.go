package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:120;not null" json:"name"`
	Email     string    `gorm:"size:180;not null;uniqueIndex" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
