package dto

import (
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
)

type MessageResponse struct {
	ID            uint               `json:"id" binding:"required"`
	Content       string             `json:"content" binding:"required"`
	ChatID        uint               `json:"chat_id" binding:"required"`
	SenderID      uint               `json:"sender_id" binding:"required"`
	CreatedAt     time.Time          `json:"created_at" binding:"required"`
	Reactions     []ReactionResponse `json:"reactions" binding:"required"`
	LastReadUsers []uint             `json:"last_read_users" binding:"required"`
}

type SendMessageRequest struct {
	ChatID  uint   `json:"chat_id" validate:"required" binding:"required"`
	Content string `json:"content" validate:"required" binding:"required"`
}

type EventType string

const (
	EventError         EventType = "ERROR"
	EventMessage       EventType = "MESSAGE"
	EventUnreadMessage EventType = "UNREAD_MESSAGE"
	EventTypingStart   EventType = "TYPING_START"
	EventTypingEnd     EventType = "TYPING_END"
	EventReaction      EventType = "REACTION"
	EventRead          EventType = "READ"
	EventStillActive   EventType = "STILL_ACTIVE"
)

type SendRealtimeMessageRequest struct {
	EventType EventType `json:"event_type" validate:"required" binding:"required"`
	Content   string    `json:"content" validate:"required" binding:"required"`
	SenderID  uint      `json:"sender_id"`
	ChatID    uint      `json:"chat_id"`
	MessageID uint      `json:"message_id"`
}

type UserLastRead struct {
	UserID    uint
	MessageID uint
}

func (e EventType) String() string {
	return string(e)
}

func ValidateEventType(eventType string) bool {
	switch EventType(eventType) {
	case EventError, EventMessage, EventTypingStart, EventTypingEnd, EventReaction, EventRead, EventStillActive:
		return true
	}
	return false
}

func ToMessageResponse(message model.Message, lastReadUsers []uint) MessageResponse {
	return MessageResponse{
		ID:            message.ID,
		Content:       message.Content,
		ChatID:        message.ChatID,
		SenderID:      message.SenderID,
		CreatedAt:     message.CreatedAt,
		Reactions:     ToReactionResponseList(message.Reactions),
		LastReadUsers: lastReadUsers,
	}
}

func ToMessageResponseList(messages []model.Message, userLastReads []UserLastRead) []MessageResponse {
	messageIdToLastReadUsers := make(map[uint][]uint)
	for _, userLastRead := range userLastReads {
		messageIdToLastReadUsers[userLastRead.MessageID] = append(messageIdToLastReadUsers[userLastRead.MessageID], userLastRead.UserID)
	}

	messageResponses := make([]MessageResponse, len(messages))
	for i, message := range messages {
		if lastReadUsers, ok := messageIdToLastReadUsers[message.ID]; ok {
			messageResponses[i] = ToMessageResponse(message, lastReadUsers)
		} else {
			messageResponses[i] = ToMessageResponse(message, []uint{})
		}
	}
	return messageResponses
}
