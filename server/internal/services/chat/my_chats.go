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
	_, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	userID, err := h.authMiddleware.GetUserIDFromContext(c.UserContext())
	if err != nil {
		return errors.Wrap(err, "failed to get user id from context")
	}

	var user model.User
	err = h.store.DB.Model(&model.User{}).
		Where("id = ?", userID).
		Preload("Chats.Participants").Find(&user).Error
	if err != nil {
		return apperror.Internal("failed to get chats", err)
	}

	lastMessages := make([]model.Message, len(user.Chats))
	chatIDs := make([]uint, len(user.Chats))
	for i, chat := range user.Chats {
		chatIDs[i] = chat.ID
	}
	err = h.store.DB.Raw(`
	SELECT DISTINCT ON (chat_id) *
	FROM messages
	WHERE chat_id IN ?
	ORDER BY chat_id, created_at DESC
	`, chatIDs).Scan(&lastMessages).Error

	result := dto.ToChatResponseList(user.Chats, lastMessages)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.ChatResponse]{
		Result: result,
	})
}
