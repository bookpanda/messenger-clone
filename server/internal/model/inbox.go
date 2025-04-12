package model

import "gorm.io/gorm"

type Inbox struct {
	gorm.Model
	MessageID string  `gorm:"not null"`
	Message   Message `gorm:"foreignKey:MessageID"`

	UserID string `gorm:"not null;unique"`
	User   User   `gorm:"foreignKey:UserID"`
}
