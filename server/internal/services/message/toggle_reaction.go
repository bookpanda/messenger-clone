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
	"gorm.io/gorm"
)

// @Summary			Toggle reaction
// @Description		Add or remove a reaction (emoji) to a specific message
// @Tags			message
// @Router			/api/v1/message/{id}/react [POST]
// @Param			id				path	uint							true	"Message ID"
// @Param 			RequestBody 	body 	dto.ToggleReactionRequest 		true 	"request request"
// @Success			200	{object}	dto.ToggleReactionResponse
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleToggleReaction(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	messageID, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return apperror.BadRequest("invalid messageID param", err)
	}

	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return apperror.Internal("failed to get userID from context", err)
	}

	req := new(dto.ToggleReactionRequest)
	if err := c.BodyParser(&req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}
	if req.Emoji == "" {
		return apperror.BadRequest("emoji is required", nil)
	}

	reaction, err := h.ToggleReaction(uint(messageID), userID, req.Emoji)
	if err != nil {
		return apperror.Internal("failed to toggle reaction", err)
	}

	if reaction == nil {
		return c.Status(fiber.StatusOK).JSON(dto.ToggleReactionResponse{
			Action: "removed",
		})
	}

	result := dto.ToReactionResponse(*reaction)
	return c.Status(fiber.StatusOK).JSON(dto.ToggleReactionResponse{
		Action:   "created",
		Reaction: &result,
	})
}

func (h *Handler) ToggleReaction(messageID uint, senderID uint, emoji string) (*model.Reaction, error) {
	var reaction model.Reaction

	err := h.store.DB.
		Where("message_id = ? AND sender_id = ? AND emoji = ?", messageID, senderID, emoji).
		First(&reaction).Error

	if err == nil {
		// Found → delete it
		if err := h.store.DB.Delete(&reaction).Error; err != nil {
			return nil, errors.Wrap(err, "failed to delete existing reaction")
		}
		return nil, nil
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Not found → create it
		reaction := model.Reaction{
			MessageID: messageID,
			SenderID:  senderID,
			Emoji:     emoji,
		}
		if err := h.store.DB.Create(&reaction).Error; err != nil {
			return nil, errors.Wrap(err, "failed to create new reaction")
		}
		return &reaction, nil
	}

	return nil, errors.Wrap(err, "failed to toggle reaction")
}
