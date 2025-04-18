package message

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/pkg/errors"
)

func (h *Handler) getChat(chatID uint) (model.Chat, error) {
	var chat model.Chat

	err := h.store.DB.
		Preload("Participants.User").
		First(&chat, chatID).Error
	if err != nil {
		return model.Chat{}, errors.Wrap(err, "failed to load chat participants")
	}

	return chat, nil
}
