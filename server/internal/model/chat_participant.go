package model

import "gorm.io/gorm"

type ChatParticipant struct {
	gorm.Model
	ChatID uint `gorm:"not null"`
	Chat   Chat `gorm:"foreignKey:ChatID"`

	UserID uint `gorm:"not null"`
	User   User `gorm:"foreignKey:UserID"`
}
