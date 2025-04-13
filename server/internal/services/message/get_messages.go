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

// @Summary			Get messages
// @Description		Get messages of a chat
// @Tags			message
// @Router			/api/v1/message/chat/{id} [GET]
// @Param 			RequestBody 	body 	dto.SendMessageRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.MessageResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetMessages(c *fiber.Ctx) error {
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
