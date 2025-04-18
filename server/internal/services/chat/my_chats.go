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

// @Summary			My chats
// @Description		Get all chats of the user
// @Tags			chat
// @Router			/api/v1/chat [GET]
// @Security		ApiKeyAuth
// @Success			200	{object}	dto.HttpListResponse[dto.ChatResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetMyChats(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get user ID from context")
	}

	// 1. Load user's ChatParticipant records with Chat & Participants
	var chatParticipants []model.ChatParticipant
	err = h.store.DB.WithContext(ctx).
		Preload("Chat.Participants.User"). // full chat data with participants
		Where("user_id = ?", userID).
		Find(&chatParticipants).Error
	if err != nil {
		return apperror.Internal("failed to get user's chats", err)
	}

	// 2. Extract Chat list
	chats := make([]model.Chat, len(chatParticipants))
	chatIDs := make([]uint, len(chatParticipants))
	for i, cp := range chatParticipants {
		chats[i] = cp.Chat
		chatIDs[i] = cp.ChatID
	}

	// 3. Load latest messages
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

	// 4. Load unread counts
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

	// 5. Transform into ChatResponse list
	result := dto.ToChatResponseList(chats, lastMessages, unreadMap)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.ChatResponse]{
		Result: result,
	})
}
