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

// @Summary			Modify participants
// @Description		Add/remove participants to/from chat
// @Tags			chat
// @Router			/api/v1/chat/{id}/participant/{participantId}/nickname [PATCH]
// @Security		ApiKeyAuth
// @Param			id				path		uint	true	"Chat ID"
// @Param			participantId	path		uint	true	"Participant ID"
// @Param 			RequestBody 	body 	dto.ChangeNicknameRequest 	true 	"request request"
// @Success			204
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleParticipantChangeNickname(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	// 1. Parse chat ID
	chatID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return apperror.BadRequest("invalid chat id", err)
	}

	// 2. Parse participant (user) ID
	participantID, err := strconv.ParseUint(c.Params("participantId"), 10, 64)
	if err != nil {
		return apperror.BadRequest("invalid participant id", err)
	}

	// 3. Parse body and validate
	req := new(dto.ChangeNicknameRequest)
	if err := c.BodyParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}
	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	// 4. Update the nickname for the participant in the chat
	err = h.store.DB.WithContext(ctx).
		Model(&model.ChatParticipant{}).
		Where("chat_id = ? AND user_id = ?", chatID, participantID).
		Update("nickname", req.Nickname).Error
	if err != nil {
		return apperror.Internal("failed to update nickname", err)
	}

	// 5. Get All participants in Chat
	chat, err := h.getChat(uint(chatID))
	if err != nil {
		return apperror.Internal("failed to get chat", err)
	}

	chatInfo := dto.ToChatResponse(chat, nil, 0)

	// 6. Broadcast the change to all participants
	jsonPayload, err := json.Marshal(chatInfo)
	if err != nil {
		return apperror.Internal("failed to marshal participants", err)
	}
	if err := h.chatServer.BroadcastToRoom(dto.EventChatInfoUpdate, uint(chatID), 0, nil, string(jsonPayload)); err != nil {
		return apperror.Internal("failed to broadcast message", err)
	}

	// 7. Return success
	return c.SendStatus(fiber.StatusNoContent)
}
