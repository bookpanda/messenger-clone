package message

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

func (h *Handler) getLastMessage(chatID uint) (*model.Message, error) {
	var message model.Message

	err := h.store.DB.
		Model(&model.Message{}).
		Where("chat_id = ?", chatID).
		Order("created_at DESC").
		Preload("Sender").
		Preload("Reactions").
		Preload("ReplyToMessage").
		First(&message).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // no message yet
		}
		return nil, errors.Wrap(err, "failed to fetch last message")
	}

	return &message, nil
}
