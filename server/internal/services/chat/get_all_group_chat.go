package chat

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// @Summary			Get All Group Chats
// @Description		Get All Group Chats
// @Tags			chat
// @Router			/api/v1/chat/group [GET]
// @Security		ApiKeyAuth
// @Success			200	{object}	dto.HttpListResponse[dto.ChatResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetGroupChats(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get user id from context")
	}

	// Step 1: Load all group chats (not only those joined by user)
	var chats []model.Chat
	err = h.store.DB.WithContext(ctx).
		Model(&model.Chat{}).
		Where("is_direct = false").
		Preload("Participants.User").
		Find(&chats).Error
	if err != nil {
		return apperror.Internal("failed to load group chats", err)
	}

	if len(chats) == 0 {
		return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.ChatResponse]{
			Result: []dto.ChatResponse{},
		})
	}

	// Step 2: Get last messages for those chats
	chatIDs := make([]uint, len(chats))
	for i, chat := range chats {
		chatIDs[i] = chat.ID
	}

	var lastMessages []model.Message
	err = h.store.DB.WithContext(ctx).Raw(`
		SELECT DISTINCT ON (chat_id) *
		FROM messages
		WHERE chat_id IN ?
		ORDER BY chat_id, created_at DESC
	`, chatIDs).Scan(&lastMessages).Error
	if err != nil {
		return apperror.Internal("failed to get last messages", err)
	}

	// Step 3: Get unread counts (only for chats that the user joined)
	type UnreadCountResult struct {
		ChatID      uint `gorm:"column:chat_id"`
		UnreadCount int  `gorm:"column:unread_count"`
	}
	var unreadCounts []UnreadCountResult

	err = h.store.DB.WithContext(ctx).Raw(`
		SELECT messages.chat_id, COUNT(messages.id) AS unread_count
		FROM messages
		LEFT JOIN message_reads ON messages.id = message_reads.message_id AND message_reads.user_id = ?
		WHERE messages.chat_id IN ?
		  AND messages.sender_id != ?
		  AND message_reads.user_id IS NULL
		GROUP BY messages.chat_id
	`, userID, chatIDs, userID).Scan(&unreadCounts).Error
	if err != nil {
		return apperror.Internal("failed to get unread counts", err)
	}

	unreadMap := make(map[uint]uint)
	for _, uc := range unreadCounts {
		unreadMap[uc.ChatID] = uint(uc.UnreadCount)
	}

	// Step 4: Convert to response
	result := dto.ToChatResponseList(chats, lastMessages, unreadMap)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.ChatResponse]{
		Result: result,
	})
}
