package dto

type CreateChatRequest struct {
	Name         string   `json:"name" validate:"required"`
	Participants []string `json:"participants" validate:"required"`
}

type CreateChatResponse struct {
	ID           uint           `json:"id"`
	Name         string         `json:"name"`
	Participants []UserResponse `json:"participants"`
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
	ID           uint           `json:"id"`
	Name         string         `json:"name"`
	Participants []UserResponse `json:"participants"`
}
