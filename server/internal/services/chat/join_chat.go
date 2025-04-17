package chat

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
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
	ctx, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	// Step 1: Get user ID
	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get user ID from context")
	}

	// Step 2: Get chat ID
	chatID, err := c.ParamsInt("id")
	if err != nil || chatID <= 0 {
		return apperror.BadRequest("invalid chat ID", err)
	}

	// Step 3: Ensure the chat exists and is not direct
	var chat model.Chat
	err = h.store.DB.WithContext(ctx).
		Where("id = ? AND is_direct = false", chatID).
		First(&chat).Error
	if err != nil {
		return apperror.NotFound("group chat not found", err)
	}

	// Step 4: Check if user already joined
	var exists bool
	err = h.store.DB.WithContext(ctx).
		Model(&model.ChatParticipant{}).
		Select("count(1) > 0").
		Where("chat_id = ? AND user_id = ?", chatID, userID).
		Find(&exists).Error
	if err != nil {
		return apperror.Internal("failed to check participation", err)
	}
	if exists {
		return c.SendStatus(fiber.StatusNoContent)
	}

	// Step 5: Add user to chat
	newParticipant := model.ChatParticipant{
		ChatID: uint(chatID),
		UserID: uint(userID),
	}
	if err := h.store.DB.WithContext(ctx).Create(&newParticipant).Error; err != nil {
		return apperror.Internal("failed to join chat", err)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
