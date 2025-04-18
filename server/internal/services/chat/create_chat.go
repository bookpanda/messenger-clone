package chat

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/internal/utils"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

// @Summary			Create chat
// @Description		Create chat with name and participants. If is_direct is true, it will create that direct chat or return the existing one.
// @Tags			chat
// @Router			/api/v1/chat [POST]
// @Security		ApiKeyAuth
// @Param 			RequestBody 	body 	dto.CreateChatRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.ChatResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleCreateChat(c *fiber.Ctx) error {
	_, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	// 1. Parse and validate request
	req := new(dto.CreateChatRequest)
	if err := c.BodyParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}
	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("validation failed", err)
	}

	req.Participants = utils.RemoveDuplicates(req.Participants)

	// 2. Verify all users exist
	participants, err := h.VerifyParticipants(req.Participants)
	if err != nil {
		return apperror.BadRequest("some participants not found", err)
	}

	// 3. If direct chat, enforce only 2 participants and check for existing
	if req.IsDirect {
		if len(participants) != 2 {
			return apperror.BadRequest("direct chat must have exactly 2 participants", errors.New("invalid participant count"))
		}

		// Sort user IDs to match order
		userIDs := []uint{participants[0].ID, participants[1].ID}
		if userIDs[0] > userIDs[1] {
			userIDs[0], userIDs[1] = userIDs[1], userIDs[0]
		}

		var existingChatID uint
		err := h.store.DB.Raw(`
			SELECT c.id
			FROM chats c
			JOIN chat_participants cp1 ON cp1.chat_id = c.id
			JOIN chat_participants cp2 ON cp2.chat_id = c.id
			WHERE c.is_direct = true
			  AND cp1.user_id = ?
			  AND cp2.user_id = ?
			GROUP BY c.id
			HAVING COUNT(*) = 2
		`, userIDs[0], userIDs[1]).Scan(&existingChatID).Error

		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return apperror.Internal("failed to check for existing direct chat", err)
		}

		if existingChatID != 0 {
			// Return existing chat
			var existingChat model.Chat
			err := h.store.DB.
				Preload("Participants.User").
				First(&existingChat, existingChatID).Error
			if err != nil {
				return apperror.Internal("failed to fetch existing chat", err)
			}

			return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ChatResponse]{
				Result: dto.ToChatResponse(existingChat, nil, 0),
			})
		}
	}

	// 4. Create chat & attach participants
	var chat *model.Chat
	var finalParticipants []model.ChatParticipant

	if err := h.store.DB.Transaction(func(tx *gorm.DB) error {
		chat, err = h.createChat(req.Name, req.IsDirect)
		if err != nil {
			return errors.Wrap(err, "failed to create chat")
		}
		finalParticipants, err = h.ModifyParticipants(dto.AddParticipant, chat.ID, participants)
		if err != nil {
			return errors.Wrap(err, "failed to add participants")
		}
		return nil
	}); err != nil {
		return apperror.Internal("chat creation failed", err)
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ChatResponse]{
		Result: dto.ChatResponse{
			ID:           chat.ID,
			Name:         chat.Name,
			IsDirect:     chat.IsDirect,
			Participants: dto.ToParticipantResponseList(finalParticipants),
		},
	})
}

func (h *Handler) createChat(name string, isDirect bool) (*model.Chat, error) {
	chat := &model.Chat{
		Name:     name,
		IsDirect: isDirect,
	}

	if err := h.store.DB.Create(chat).Error; err != nil {
		return nil, errors.Wrap(err, "failed to create chat")
	}

	return chat, nil
}
