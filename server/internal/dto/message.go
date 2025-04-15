package dto

import (
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
)

type MessageResponse struct {
	ID        uint               `json:"id" binding:"required"`
	Content   string             `json:"content" binding:"required"`
	ChatID    uint               `json:"chat_id" binding:"required"`
	SenderID  uint               `json:"sender_id" binding:"required"`
	CreatedAt time.Time          `json:"created_at" binding:"required"`
	Reactions []ReactionResponse `json:"reactions" binding:"required"`
}

type SendMessageRequest struct {
	ChatID  uint   `json:"chat_id" validate:"required" binding:"required"`
	Content string `json:"content" validate:"required" binding:"required"`
}

type EventType string

const (
	EventError       EventType = "ERROR"
	EventMessage     EventType = "MESSAGE"
	EventTypingStart EventType = "TYPING_START"
	EventTypingEnd   EventType = "TYPING_END"
	EventReaction    EventType = "REACTION"
	EventRead        EventType = "READ"
)

type SendRealtimeMessageRequest struct {
	EventType EventType `json:"event_type" validate:"required" binding:"required"`
	Content   string    `json:"content" validate:"required" binding:"required"`
	SenderID  uint      `json:"sender_id"`
}

func (e EventType) String() string {
	return string(e)
}

func ValidateEventType(eventType string) bool {
	switch EventType(eventType) {
	case EventError, EventMessage, EventTypingStart, EventTypingEnd, EventReaction, EventRead:
		return true
	}
	return false
}

func ToMessageResponse(message model.Message) MessageResponse {
	return MessageResponse{
		ID:        message.ID,
		Content:   message.Content,
		ChatID:    message.ChatID,
		SenderID:  message.SenderID,
		CreatedAt: message.CreatedAt,
		Reactions: ToReactionResponseList(message.Reactions),
	}
}

func ToMessageResponseList(messages []model.Message) []MessageResponse {
	messageResponses := make([]MessageResponse, len(messages))
	for i, message := range messages {
		messageResponses[i] = ToMessageResponse(message)
	}
	return messageResponses
}
