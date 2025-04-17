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
	ctx, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	chatID, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return apperror.BadRequest("invalid chat id", err)
	}

	// Load chat with participants
	var chat model.Chat
	err = h.store.DB.WithContext(ctx).
		Model(&model.Chat{}).
		Preload("Participants").
		Where("id = ?", chatID).
		First(&chat).Error
	if err != nil {
		return errors.Wrap(err, "failed to find chat")
	}

	// Check if current user is a participant
	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
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
		return apperror.Forbidden("user is not a participant of the chat", errors.New("unauthorized access to chat"))
	}

	// 🔹 Load messages with ReadBy preloaded
	var messages []model.Message
	err = h.store.DB.WithContext(ctx).
		Model(&model.Message{}).
		Where("chat_id = ?", chatID).
		Order("created_at ASC").
		Preload("Sender").
		Preload("Reactions").
		Preload("ReplyToMessage").
		Preload("ReadBy").
		Find(&messages).Error
	if err != nil {
		return errors.Wrap(err, "failed to load messages")
	}

	// Mark all unread messages as read by this user
	// (only if not already in ReadBy)
	var user model.User
	if err := h.store.DB.WithContext(ctx).First(&user, userID).Error; err != nil {
		return apperror.Internal("failed to fetch user", err)
	}

	for _, m := range messages {
		alreadyRead := false
		for _, reader := range m.ReadBy {
			if reader.ID == userID {
				alreadyRead = true
				break
			}
		}
		if !alreadyRead {
			err := h.store.DB.WithContext(ctx).
				Model(&m).
				Association("ReadBy").
				Append(&user)
			if err != nil {
				return errors.Wrapf(err, "failed to mark message %d as read", m.ID)
			}
		}
	}

	// Convert to DTO
	result := dto.ToMessageResponseList(messages)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.MessageResponse]{
		Result: result,
	})
}
