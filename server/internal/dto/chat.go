package dto

import "github.com/bookpanda/messenger-clone/internal/model"

type ChatResponse struct {
	ID           uint                  `json:"id" binding:"required"`
	Name         string                `json:"name" binding:"required"`
	IsDirect     bool                  `json:"is_direct" binding:"required"`
	Participants []ParticipantResponse `json:"participants" binding:"required"`
	UnreadCount  uint                  `json:"unread_count" binding:"required"`
	LastMessage  *MessageResponse      `json:"last_message,omitempty"`
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

type GetChatRequest struct {
	ID uint `params:"id" validate:"required" binding:"required"`
}

type ModifyParticipantRequest struct {
	Action       string   `json:"action" validate:"required" binding:"required"`
	Participants []string `json:"participants" validate:"required" binding:"required"`
}

type ModifyParticipantResponse struct {
	Participants []ParticipantResponse `json:"participants" binding:"required"`
}

type ChangeNicknameRequest struct {
	Nickname string `json:"nickname" validate:"required"`
}

type ParticipantResponse struct {
	UserResponse
	Nickname string `json:"nickname" binding:"required"`
}

func ToParticipantResponse(user model.User, nickname string) ParticipantResponse {
	return ParticipantResponse{
		UserResponse: UserResponse{
			ID:                user.ID,
			Name:              user.Name,
			Email:             user.Email,
			ProfilePictureURL: user.ProfilePictureURL,
		},
		Nickname: nickname,
	}
}

func ToParticipantResponseList(participants []model.ChatParticipant) []ParticipantResponse {
	participantResponses := make([]ParticipantResponse, len(participants))
	for i, cp := range participants {
		participantResponses[i] = ToParticipantResponse(cp.User, cp.Nickname)
	}
	return participantResponses
}

func ToChatResponse(chat model.Chat, lastMessage *model.Message, unreadCount uint) ChatResponse {
	var lastMsg *MessageResponse
	if lastMessage != nil {
		msg := ToMessageResponse(*lastMessage)
		lastMsg = &msg
	}

	return ChatResponse{
		ID:           chat.ID,
		Name:         chat.Name,
		IsDirect:     chat.IsDirect,
		Participants: ToParticipantResponseList(chat.Participants),
		LastMessage:  lastMsg,
		UnreadCount:  unreadCount,
	}
}

func ToChatResponseList(chats []model.Chat, lastMessages []model.Message, unreadCount map[uint]uint) []ChatResponse {
	lastMessageMap := make(map[uint]*model.Message)
	for i := range lastMessages {
		msg := lastMessages[i] // get reference for pointer
		lastMessageMap[msg.ChatID] = &msg
	}

	chatResponses := make([]ChatResponse, len(chats))
	for i, chat := range chats {
		lastMsg := lastMessageMap[chat.ID]
		chatResponses[i] = ToChatResponse(chat, lastMsg, unreadCount[chat.ID])
	}
	return chatResponses
}
