package message

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/pkg/errors"
)

func (h *Handler) getCurrentParticipantsInChat(chatID uint) ([]model.User, error) {
	var chat model.Chat

	err := h.store.DB.
		Model(&model.Chat{}).
		Preload("Participants").
		First(&chat, chatID).Error
	if err != nil {
		return nil, errors.Wrap(err, "failed to load chat participants")
	}

	return chat.Participants, nil
}
