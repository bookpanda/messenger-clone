package dto

type CreateChatRequest struct {
	Name         string   `json:"name" validate:"required"`
	Participants []string `json:"participants" validate:"required"`
}

type CreateChatResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
