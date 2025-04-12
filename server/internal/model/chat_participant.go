package model

import "gorm.io/gorm"

type ChatParticipant struct {
	gorm.Model
	ChatID string `gorm:"not null"`
	Chat   Chat   `gorm:"foreignKey:ChatID"`

	UserID string `gorm:"not null;unique"`
	User   User   `gorm:"foreignKey:UserID"`
}
