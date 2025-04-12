package model

import (
	"gorm.io/gorm"
)

type Reaction struct {
	gorm.Model
	Emoji string `gorm:"not null"`

	MessageID uint    `gorm:"not null"`
	Message   Message `gorm:"foreignKey:MessageID"`

	SenderID uint `gorm:"not null"`
	Sender   User `gorm:"foreignKey:SenderID"`
}
