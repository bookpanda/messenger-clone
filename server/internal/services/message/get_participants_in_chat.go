package message

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/pkg/errors"
)

func (h *Handler) getCurrentParticipantsInChat(chatID uint) ([]model.User, error) {
	var chat model.Chat

	err := h.store.DB.
		Preload("Participants.User").
		First(&chat, chatID).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to load chat participants")
	}

	users := make([]model.User, len(chat.Participants))
	for i, p := range chat.Participants {
		users[i] = p.User
	}

	return users, nil
}
