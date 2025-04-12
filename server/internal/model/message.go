package model

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	MessageTypeText      MessageType = "TEXT"
	MessageTypeImage     MessageType = "IMAGE"
	MessageTypeQuotation MessageType = "QUOTATION"
	MessageTypePreview   MessageType = "PREVIEW"
)

type Message struct {
	gorm.Model
	Content string `gorm:"not null"`

	ChatID uint `gorm:"not null"`
	Chat   Chat `gorm:"foreignKey:ChatID"`

	SenderID uint `gorm:"not null"`
	Sender   User `gorm:"foreignKey:SenderID"`
}

func ValidateMessageType(msgType string) bool {
	switch MessageType(msgType) {
	case MessageTypeText, MessageTypeImage, MessageTypeQuotation, MessageTypePreview:
		return true
	default:
		return false
	}
}
