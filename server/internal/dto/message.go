package dto

type MessageResponse struct {
	ID      uint   `json:"id"`
	Content string `json:"name"`
}

type SendMessageRequest struct {
	ChatID  uint   `json:"chat_id" validate:"required"`
	Content string `json:"content" validate:"required"`
}
