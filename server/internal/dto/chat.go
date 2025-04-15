package dto

import "github.com/bookpanda/messenger-clone/internal/model"

type ChatResponse struct {
	ID           uint             `json:"id" binding:"required"`
	Name         string           `json:"name" binding:"required"`
	IsDirect     bool             `json:"is_direct" binding:"required"`
	Participants []UserResponse   `json:"participants" binding:"required"`
	LastMessage  *MessageResponse `json:"last_message,omitempty"`
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

func ToChatResponse(chat model.Chat, lastMessage *model.Message) ChatResponse {
	var lastMsg *MessageResponse
	if lastMessage != nil {
		msg := ToMessageResponse(*lastMessage, []uint{})
		lastMsg = &msg
	}

	return ChatResponse{
		ID:           chat.ID,
		Name:         chat.Name,
		IsDirect:     chat.IsDirect,
		Participants: ToUserResponseList(chat.Participants),
		LastMessage:  lastMsg,
	}
}

func ToChatResponseList(chats []model.Chat, lastMessages []model.Message) []ChatResponse {
	lastMessageMap := make(map[uint]*model.Message)
	for i := range lastMessages {
		msg := lastMessages[i] // get reference for pointer
		lastMessageMap[msg.ChatID] = &msg
	}

	chatResponses := make([]ChatResponse, len(chats))
	for i, chat := range chats {
		lastMsg := lastMessageMap[chat.ID]
		chatResponses[i] = ToChatResponse(chat, lastMsg)
	}
	return chatResponses
}
