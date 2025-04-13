package model

import "gorm.io/gorm"

type Inbox struct {
	gorm.Model
	MessageID uint    `gorm:"not null;index:idx_message_user,unique"`
	Message   Message `gorm:"foreignKey:MessageID"`

	UserID uint `gorm:"not null;index:idx_message_user,unique"`
	User   User `gorm:"foreignKey:UserID"`
}
