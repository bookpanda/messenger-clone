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

	result := dto.ToChatResponseList(user.Chats)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.ChatResponse]{
		Result: result,
	})
}
