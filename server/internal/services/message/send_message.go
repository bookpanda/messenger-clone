package message

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

// @Summary			Send message
// @Description		Send message to a chat and distribute it to participants
// @Tags			chat
// @Router			/api/v1/message [POST]
// @Param 			RequestBody 	body 	dto.SendMessageRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.MessageResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleSendMessage(c *fiber.Ctx) error {
	_, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	req := new(dto.SendMessageRequest)
	if err := c.BodyParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	userID, err := h.authMiddleware.GetUserIDFromContext(c.UserContext())
	if err != nil {
		return apperror.Internal("failed to get user id from context", err)
	}

	var message *model.Message
	if err := h.store.DB.Transaction(func(tx *gorm.DB) error {
		message, err = h.createMessage(req.ChatID, req.Content, userID)
		if err != nil {
			return errors.Wrap(err, "failed to create chat")
		}

		err = h.sendMessageToParticipants(req.ChatID, message.ID, userID)
		if err != nil {
			return errors.Wrap(err, "failed to send message to participants")
		}

		return nil
	}); err != nil {
		return apperror.Internal("failed to create chat", err)
	}

	result := dto.MessageResponse{
		ID:      message.ID,
		Content: message.Content,
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.MessageResponse]{
		Result: result,
	})
}

func (h *Handler) createMessage(chatID uint, content string, senderID uint) (*model.Message, error) {
	message := &model.Message{
		ChatID:   chatID,
		Content:  content,
		SenderID: senderID,
	}

	if err := h.store.DB.Create(message).Error; err != nil {
		return nil, errors.Wrap(err, "failed to create message")
	}

	return message, nil
}

func (h *Handler) sendMessageToParticipants(chatID uint, messageID uint, senderID uint) error {
	var chat model.Chat
	err := h.store.DB.Model(&model.Chat{}).
		Where("id = ?", chatID).
		Preload("Participants").First(&chat).Error
	if err != nil {
		return errors.Wrap(err, "failed to find chat")
	}

	var inboxes []model.Inbox
	for _, participant := range chat.Participants {
		// skip sender
		if participant.ID == senderID {
			continue
		}

		inbox := model.Inbox{
			MessageID: messageID,
			UserID:    participant.ID,
		}
		inboxes = append(inboxes, inbox)
	}

	if len(inboxes) > 0 {
		if err := h.store.DB.Create(&inboxes).Error; err != nil {
			return errors.Wrap(err, "failed to create inbox entries")
		}
	}

	return nil
}
