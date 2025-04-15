package message

import (
	"context"
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

	// get only read messages (inbox is deleted)
	var messages []model.Message
	err = h.store.DB.Model(&model.Message{}).
		Joins("JOIN inboxes ON inboxes.message_id = messages.id").
		Where("messages.chat_id = ? AND (inboxes.user_id = ? AND inboxes.deleted_at IS NOT NULL)", chatID, userID).
		Preload("Reactions").
		Find(&messages).Error
	if err != nil {
		return errors.Wrap(err, "failed to load messages from inbox")
	}

	var userLastReads []dto.UserLastRead
	err = h.store.DB.Raw(`
		SELECT DISTINCT ON (user_id)
			user_id, message_id, deleted_at 
		FROM inboxes
		WHERE deleted_at IS NOT NULL AND message_id IN (
			SELECT id FROM messages WHERE chat_id = ?
		) AND user_id <> ?
		ORDER BY user_id, deleted_at DESC
	`, chatID, userID).Scan(&userLastReads).Error

	result := dto.ToMessageResponseList(messages, userLastReads)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.MessageResponse]{
		Result: result,
	})
}
