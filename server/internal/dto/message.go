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
	ReadBy    []uint             `json:"read_by" binding:"required"`
}

type SendMessageRequest struct {
	ChatID  uint   `json:"chat_id" validate:"required" binding:"required"`
	Content string `json:"content" validate:"required" binding:"required"`
}

type EventType string

const (
	EventError            EventType = "ERROR"
	EventConnect          EventType = "CONNECT"           // Incoming message to server
	EventMessage          EventType = "MESSAGE"           // Incoming message to server
	EventMessageUpdate    EventType = "MESSAGE_UPDATE"    // Outgoing message from server
	EventAckRead          EventType = "ACK_READ"          // Incoming message to server
	EventRead             EventType = "READ"              // Outgoing message from server
	EventTypingStart      EventType = "TYPING_START"      // Incoming message to server
	EventTypingEnd        EventType = "TYPING_END"        // Incoming message to server
	EventOnlineUsers      EventType = "ONLINE_USERS"      // Outgoing message from server
	EventChatParticipants EventType = "CHAT_PARTICIPANTS" // Outgoing message from server

	EventUnreadMessage EventType = "UNREAD_MESSAGE"
	EventReaction      EventType = "REACTION"
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
	case EventError, EventConnect, EventMessage, EventMessageUpdate, EventAckRead, EventRead, EventTypingStart, EventTypingEnd, EventReaction:
		return true
	}
	return false
}

func ToMessageResponse(message model.Message) MessageResponse {
	readers := make([]uint, 0)
	for _, u := range message.ReadBy {
		readers = append(readers, u.ID)
	}
	return MessageResponse{
		ID:        message.ID,
		Content:   message.Content,
		ChatID:    message.ChatID,
		SenderID:  message.SenderID,
		CreatedAt: message.CreatedAt,
		Reactions: ToReactionResponseList(message.Reactions),
		ReadBy:    readers,
	}
}

func ToMessageResponseList(messages []model.Message) []MessageResponse {
	messageResponses := make([]MessageResponse, len(messages))
	for i, message := range messages {
		messageResponses[i] = ToMessageResponse(message)
	}
	return messageResponses
}
