package model

import "gorm.io/gorm"

type ChatParticipant struct {
	gorm.Model
	ChatID uint `gorm:"not null;index:idx_chat_user,unique"`
	Chat   Chat `gorm:"foreignKey:ChatID"`

	UserID uint `gorm:"not null;index:idx_chat_user,unique"`
	User   User `gorm:"foreignKey:UserID"`
}
