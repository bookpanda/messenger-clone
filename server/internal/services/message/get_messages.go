package message

import (
	"context"
	"log"
	"strconv"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// @Summary			Get messages
// @Description		Get messages of a chat
// @Tags			message
// @Router			/api/v1/message/chat/{id} [GET]
// @Param           id path uint true "Chat ID"
// @Success			200	{object}	dto.HttpListResponse[dto.MessageResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetMessages(c *fiber.Ctx) error {
	_, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	chatID, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return apperror.BadRequest("invalid chat id", err)
	}

	var chat model.Chat
	err = h.store.DB.Model(&model.Chat{}).
		Where("id = ?", chatID).
		Preload("Participants").First(&chat).Error
	if err != nil {
		return errors.Wrap(err, "failed to find chat")
	}

	// Check if user is a participant of the chat
	userID, err := h.authMiddleware.GetUserIDFromContext(c.UserContext())
	if err != nil {
		return apperror.Internal("failed to get user id from context", err)
	}
	log.Println("userID", userID)
	log.Println("chat.Participants", chat.Participants)
	isParticipant := false
	for _, participant := range chat.Participants {
		if participant.ID == userID {
			isParticipant = true
			break
		}
	}
	if !isParticipant {
		return apperror.Forbidden("user is not a participant of the chat", errors.New("user is not a participant of the chat"))
	}

	var messages []model.Message
	err = h.store.DB.Model(&model.Message{}).Preload("Reactions").Where("chat_id = ?", chatID).Find(&messages).Error

	result := dto.ToMessageResponseList(messages)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.MessageResponse]{
		Result: result,
	})
}
