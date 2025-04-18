package model

import "gorm.io/gorm"

type ChatParticipant struct {
	ChatID   uint `gorm:"primaryKey"`
	UserID   uint `gorm:"primaryKey"`
	Nickname string

	Chat Chat `gorm:"foreignKey:ChatID"`
	User User `gorm:"foreignKey:UserID"`
}

type Chat struct {
	gorm.Model
	Name         string
	IsDirect     bool
	Color        string `gorm:"default:'#0e92eb'"`
	Emoji        string `gorm:"default:'👍'"`
	Messages     []Message
	Participants []ChatParticipant `gorm:"foreignKey:ChatID"`
}
