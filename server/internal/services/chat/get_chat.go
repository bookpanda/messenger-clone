package chat

import (
	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

// @Summary			Get Chat by Id
// @Description		Get Chat Information
// @Tags			chat
// @Router			/api/v1/chat/{id} [GET]
// @Param			id	path		uint	true	"Chat ID"
// @Security		ApiKeyAuth
// @Success			200	{object}	dto.HttpResponse[dto.ChatResponse]
// @Failure			401	{object}	dto.HttpError
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetChat(c *fiber.Ctx) error {
	userID, err := h.authMiddleware.GetUserIDFromContext(c.UserContext())
	if err != nil {
		return errors.Wrap(err, "failed to get user id from context")
	}

	req := new(dto.GetChatRequest)
	if err := c.ParamsParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	// Step 1: Load chat and ensure user is a participant
	var chat model.Chat
	err = h.store.DB.
		Model(&model.Chat{}).
		Preload("Participants.User").
		Joins("JOIN chat_participants ON chat_participants.chat_id = chats.id").
		Where("chats.id = ?", req.ID).
		Where("chat_participants.user_id = ?", userID).
		First(&chat).Error
	if err != nil {
		return apperror.Internal("failed to get chat", err)
	}

	// Step 2: Get last message in the chat
	var lastMessage model.Message
	err = h.store.DB.
		Where("chat_id = ?", chat.ID).
		Order("created_at DESC").
		First(&lastMessage).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return apperror.Internal("failed to get last message", err)
	}

	// Step 3: Get unread count for this chat
	var unreadCount int64
	err = h.store.DB.
		Raw(`
			SELECT COUNT(messages.id)
			FROM messages
			LEFT JOIN message_reads ON messages.id = message_reads.message_id AND message_reads.user_id = ?
			WHERE messages.chat_id = ?
			  AND messages.sender_id != ?
			  AND message_reads.user_id IS NULL
		`, userID, chat.ID, userID).
		Scan(&unreadCount).Error
	if err != nil {
		return apperror.Internal("failed to get unread count", err)
	}

	// Step 4: Prepare response with unread count
	result := dto.ToChatResponse(chat, &lastMessage, uint(unreadCount))

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ChatResponse]{
		Result: result,
	})
}
