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
// @Tags			message
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

	userID, err := h.authMiddleware.GetUserIDFromContext(c.UserContext())
	if err != nil {
		return apperror.Internal("failed to get user id from context", err)
	}

	message, err := h.SendMessage(*req, userID)
	if err != nil {
		return err
	}

	result := dto.MessageResponse{
		ID:        message.ID,
		ChatID:    message.ChatID,
		Content:   message.Content,
		SenderID:  message.SenderID,
		CreatedAt: message.CreatedAt,
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.MessageResponse]{
		Result: result,
	})
}

func (h *Handler) SendMessage(req dto.SendMessageRequest, senderID uint) (*model.Message, error) {
	if err := h.validate.Struct(req); err != nil {
		return nil, apperror.BadRequest("invalid request body", err)
	}

	var message *model.Message
	var err error
	if err := h.store.DB.Transaction(func(tx *gorm.DB) error {
		message, err = h.createMessage(req.ChatID, req.Content, senderID)
		if err != nil {
			return errors.Wrap(err, "failed to create chat")
		}

		err = h.sendMessageToParticipants(req.ChatID, message.ID, senderID)
		if err != nil {
			return errors.Wrap(err, "failed to send message to participants")
		}

		return nil
	}); err != nil {
		return nil, apperror.Internal("failed to create chat", err)
	}

	return message, nil
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
