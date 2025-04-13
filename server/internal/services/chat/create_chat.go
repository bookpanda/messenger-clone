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
	_, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	req := new(dto.CreateChatRequest)
	if err := c.BodyParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	req.Participants = utils.RemoveDuplicates(req.Participants)

	participants, err := h.VerifyParticipants(req.Participants)
	if err != nil {
		return apperror.BadRequest("some participants not found", err)
	}

	if req.IsDirect {
		if len(participants) != 2 {
			return apperror.BadRequest("direct chat must have exactly 2 participants", errors.New("invalid number of participants"))
		}

		// Check if a direct chat already exists between the two participants
		var existingChat model.Chat
		userIds := make([]uint, len(participants))
		for i, participant := range participants {
			userIds[i] = participant.ID
		}

		err := h.store.DB.
			Joins("JOIN chat_participants cp ON cp.chat_id = chats.id").
			Where("is_direct = ?", true).
			Where("cp.user_id IN ?", userIds).
			Group("chats.id").
			Having("COUNT(cp.user_id) = 2").
			First(&existingChat).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return apperror.Internal("failed to check existing direct chat", err)
		}
		if existingChat.ID != 0 {
			result := dto.ChatResponse{
				ID:           existingChat.ID,
				Name:         existingChat.Name,
				IsDirect:     existingChat.IsDirect,
				Participants: dto.ToUserResponseList(participants),
			}
			return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ChatResponse]{
				Result: result,
			})
		}
	}

	var chat *model.Chat
	var finalParticipants []model.User
	if err := h.store.DB.Transaction(func(tx *gorm.DB) error {
		chat, err = h.createChat(req.Name, req.IsDirect)
		if err != nil {
			return errors.Wrap(err, "failed to create chat")
		}

		finalParticipants, err = h.ModifyParticipants(dto.AddParticipant, chat.ID, participants)
		if err != nil {
			return errors.Wrap(err, "failed to add participants to chat")
		}

		return nil
	}); err != nil {
		return apperror.Internal("failed to create chat", err)
	}

	result := dto.ChatResponse{
		ID:           chat.ID,
		Name:         chat.Name,
		IsDirect:     chat.IsDirect,
		Participants: dto.ToUserResponseList(finalParticipants),
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ChatResponse]{
		Result: result,
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
