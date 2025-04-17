package message

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

func (h *Handler) markAsRead(messageID, userID uint) error {
	// 1. Load the message with ReadBy and Chat.Participants
	var message model.Message
	err := h.store.DB.
		Preload("ReadBy").
		Preload("Chat").
		Preload("Chat.Participants").
		First(&message, messageID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("message not found")
		}
		return errors.Wrap(err, "failed to load message")
	}

	// 2. Check that the user is a participant of the chat
	isParticipant := false
	for _, participant := range message.Chat.Participants {
		if participant.ID == userID {
			isParticipant = true
			break
		}
	}
	if !isParticipant {
		return errors.New("user is not a participant of the chat")
	}

	// 3. Check if already read
	for _, reader := range message.ReadBy {
		if reader.ID == userID {
			return nil // already marked as read
		}
	}

	// 4. Load user (required for GORM association)
	var user model.User
	if err := h.store.DB.First(&user, userID).Error; err != nil {
		return errors.Wrap(err, "failed to load user")
	}

	// 5. Append user to ReadBy association
	if err := h.store.DB.
		Model(&message).
		Association("ReadBy").
		Append(&user); err != nil {
		return errors.Wrap(err, "failed to mark message as read")
	}

	return nil
}
