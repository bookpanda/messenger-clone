package model

import (
	"gorm.io/gorm"
)

type MessageType string

const (
	MessageTypeText  MessageType = "TEXT"
	MessageTypeImage MessageType = "IMAGE"
	MessageTypeFile  MessageType = "FILE"
)

type Message struct {
	gorm.Model
	Type    MessageType `gorm:"not null;default:TEXT"`
	Content string      `gorm:"not null"`

	ChatID uint `gorm:"not null"`
	Chat   Chat `gorm:"foreignKey:ChatID"`

	SenderID uint `gorm:"not null"`
	Sender   User `gorm:"foreignKey:SenderID"`

	IsReply          bool     `gorm:"not null;default:false"`
	ReplyToMessageID *uint    // nil if not a reply
	ReplyToMessage   *Message `gorm:"foreignKey:ReplyToMessageID"` // self-reference

	Reactions []Reaction `gorm:"foreignKey:MessageID"`

	ReadBy []User `gorm:"many2many:message_reads;"`
}

func ValidateMessageType(msgType string) bool {
	switch MessageType(msgType) {
	case MessageTypeText, MessageTypeImage, MessageTypeFile:
		return true
	default:
		return false
	}
}
