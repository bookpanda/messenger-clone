package chat

import (
	"context"
	"encoding/json"
	"strconv"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
)

// @Summary     Change chat emoji
// @Description Update the emoji of a chat
// @Tags        chat
// @Router      /api/v1/chat/{id}/emoji [PATCH]
// @Security    ApiKeyAuth
// @Param       id path uint true "Chat ID"
// @Param       body body dto.ChangeChatEmojiRequest true "New emoji"
// @Success     204
// @Failure     400 {object} dto.HttpError
// @Failure     500 {object} dto.HttpError
func (h *Handler) HandleChangeChatEmoji(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	chatID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return apperror.BadRequest("invalid chat id", err)
	}

	req := new(dto.ChangeChatEmojiRequest)
	if err := c.BodyParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}
	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("invalid emoji", err)
	}

	err = h.store.DB.WithContext(ctx).
		Model(&model.Chat{}).
		Where("id = ?", chatID).
		Update("emoji", req.Emoji).Error
	if err != nil {
		return apperror.Internal("failed to update emoji", err)
	}

	chat, err := h.getChat(uint(chatID))
	if err != nil {
		return apperror.Internal("failed to reload chat", err)
	}

	jsonPayload, _ := json.Marshal(dto.ToChatResponse(chat, nil, 0))
	_ = h.chatServer.BroadcastToRoom(dto.EventChatInfoUpdate, chat.ID, 0, nil, string(jsonPayload))

	return c.SendStatus(fiber.StatusNoContent)
}
