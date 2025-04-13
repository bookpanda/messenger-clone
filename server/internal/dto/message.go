package dto

import (
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
)

type MessageResponse struct {
	ID        uint      `json:"id" binding:"required"`
	Content   string    `json:"content" binding:"required"`
	ChatID    uint      `json:"chat_id" binding:"required"`
	SenderID  uint      `json:"sender_id" binding:"required"`
	CreatedAt time.Time `json:"created_at" binding:"required"`
}

type SendMessageRequest struct {
	ChatID  uint   `json:"chat_id" validate:"required" binding:"required"`
	Content string `json:"content" validate:"required" binding:"required"`
}

func ToMessageResponse(message model.Message) MessageResponse {
	return MessageResponse{
		ID:        message.ID,
		Content:   message.Content,
		ChatID:    message.ChatID,
		SenderID:  message.SenderID,
		CreatedAt: message.CreatedAt,
	}
}
