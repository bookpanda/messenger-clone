package model

import "gorm.io/gorm"

type Chat struct {
	gorm.Model
	Name     string `gorm:"not null"`
	IsDirect bool   `gorm:"default:false"`

	Messages     []Message
	Participants []User `gorm:"many2many:chat_participants;"`
}
