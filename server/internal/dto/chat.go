package dto

import "github.com/bookpanda/messenger-clone/internal/model"

type ChatResponse struct {
	ID           uint           `json:"id"`
	Name         string         `json:"name"`
	Participants []UserResponse `json:"participants"`
}

type CreateChatRequest struct {
	Name         string   `json:"name" validate:"required"`
	Participants []string `json:"participants" validate:"required"`
}

type ParticipantAction string

const (
	AddParticipant    ParticipantAction = "ADD"
	RemoveParticipant ParticipantAction = "REMOVE"
)

func (p ParticipantAction) String() string {
	return string(p)
}

func ValidateParticipantAction(participantAction string) bool {
	switch ParticipantAction(participantAction) {
	case AddParticipant, RemoveParticipant:
		return true
	}
	return false
}

type ModifyParticipantRequest struct {
	Action       string   `json:"action" validate:"required"`
	Participants []string `json:"participants" validate:"required"`
}

type ModifyParticipantResponse struct {
	Participants []UserResponse `json:"participants"`
}

func ToChatResponse(chat model.Chat) ChatResponse {
	return ChatResponse{
		ID:           chat.ID,
		Name:         chat.Name,
		Participants: ToUserResponseList(chat.Participants),
	}
}

func ToChatResponseList(chats []model.Chat) []ChatResponse {
	chatResponses := make([]ChatResponse, len(chats))
	for i, chat := range chats {
		chatResponses[i] = ToChatResponse(chat)
	}
	return chatResponses
}
