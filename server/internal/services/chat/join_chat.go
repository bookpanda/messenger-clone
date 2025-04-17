package chat

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

// @Summary      Join Group Chat
// @Description  Add current user to chat participants
// @Tags         chat
// @Router       /api/v1/chat/{id}/join [POST]
// @Param        id path uint true "Chat ID"
// @Security     ApiKeyAuth
// @Success      204
// @Failure      400 {object} dto.HttpError
// @Failure      404 {object} dto.HttpError
// @Failure      500 {object} dto.HttpError
func (h *Handler) HandleJoinChat(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	// Step 1: Get current user ID
	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get user id from context")
	}

	// Step 2: Get Chat ID from URL param
	chatID, err := c.ParamsInt("id")
	if err != nil || chatID <= 0 {
		return apperror.BadRequest("invalid chat ID", err)
	}

	// Step 3: Load the chat and its participants
	var chat model.Chat
	err = h.store.DB.WithContext(ctx).
		Preload("Participants").
		First(&chat, "id = ? AND is_direct = false", chatID).Error
	if err != nil {
		return apperror.NotFound("group chat not found", err)
	}

	// Step 4: Check if user is already a participant
	for _, participant := range chat.Participants {
		if participant.ID == uint(userID) {
			return c.SendStatus(fiber.StatusNoContent) // Already joined
		}
	}

	// Step 5: Add user to the chat participants (many2many: chat_participants)
	err = h.store.DB.WithContext(ctx).
		Model(&chat).
		Association("Participants").
		Append(&model.User{
			Model: gorm.Model{
				ID: uint(userID),
			},
		})
	if err != nil {
		return apperror.Internal("failed to join chat", err)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
