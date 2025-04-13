package dto

import "github.com/bookpanda/messenger-clone/internal/model"

type ChatResponse struct {
	ID           uint            `json:"id" binding:"required"`
	Name         string          `json:"name" binding:"required"`
	IsDirect     bool            `json:"is_direct" binding:"required"`
	Participants []UserResponse  `json:"participants" binding:"required"`
	LastMessage  MessageResponse `json:"last_message"`
}

type CreateChatRequest struct {
	Name         string   `json:"name" validate:"required" binding:"required"`
	IsDirect     bool     `json:"is_direct" binding:"required"`
	Participants []string `json:"participants" validate:"required" binding:"required"`
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
	Action       string   `json:"action" validate:"required" binding:"required"`
	Participants []string `json:"participants" validate:"required" binding:"required"`
}

type ModifyParticipantResponse struct {
	Participants []UserResponse `json:"participants" binding:"required"`
}

func ToChatResponse(chat model.Chat, lastMessage model.Message) ChatResponse {
	return ChatResponse{
		ID:           chat.ID,
		Name:         chat.Name,
		IsDirect:     chat.IsDirect,
		Participants: ToUserResponseList(chat.Participants),
		LastMessage:  ToMessageResponse(lastMessage),
	}
}

func ToChatResponseList(chats []model.Chat, lastMessages []model.Message) []ChatResponse {
	chatResponses := make([]ChatResponse, len(chats))
	for i, chat := range chats {
		chatResponses[i] = ToChatResponse(chat, lastMessages[i])
	}
	return chatResponses
}
