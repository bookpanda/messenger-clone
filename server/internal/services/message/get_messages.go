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
	ctx, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	// 1. Parse Chat ID
	chatID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return apperror.BadRequest("invalid chat ID", err)
	}

	// 2. Get Current User
	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return apperror.Internal("failed to get user ID from context", err)
	}

	// 3. Load Chat & Check Participant
	var chat model.Chat
	err = h.store.DB.WithContext(ctx).
		Preload("Participants.User").
		First(&chat, chatID).Error
	if err != nil {
		return errors.Wrap(err, "failed to find chat")
	}

	isParticipant := false
	for _, p := range chat.Participants {
		if p.UserID == userID {
			isParticipant = true
			break
		}
	}
	if !isParticipant {
		return apperror.Forbidden("you are not a participant in this chat", errors.New("access denied"))
	}

	// 4. Load Messages
	var messages []model.Message
	err = h.store.DB.WithContext(ctx).
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

	// 5. Load Current User for ReadBy association
	var user model.User
	if err := h.store.DB.WithContext(ctx).First(&user, userID).Error; err != nil {
		return apperror.Internal("failed to fetch user", err)
	}

	// 6. Mark Unread Messages as Read
	for _, m := range messages {
		alreadyRead := false
		for _, r := range m.ReadBy {
			if r.ID == userID {
				alreadyRead = true
				break
			}
		}
		if !alreadyRead {
			if err := h.store.DB.WithContext(ctx).
				Model(&m).
				Association("ReadBy").
				Append(&user); err != nil {
				return errors.Wrapf(err, "failed to mark message %d as read", m.ID)
			}
		}
	}

	// 7. Return Result
	result := dto.ToMessageResponseList(messages)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.MessageResponse]{
		Result: result,
	})
}
