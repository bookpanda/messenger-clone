package message

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

// @Summary			Send message
// @Description		Send message to a chat and distribute it to participants
// @Tags			chat
// @Router			/api/v1/message [POST]
// @Param 			RequestBody 	body 	dto.SendMessageRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.MessageResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleSendMessage(c *fiber.Ctx) error {
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

	var chat *model.Chat
	var finalParticipants []model.User
	if err := h.store.DB.Transaction(func(tx *gorm.DB) error {
		chat, err = h.createChat(req.Name)
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
		Participants: dto.ToUserResponseList(finalParticipants),
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ChatResponse]{
		Result: result,
	})
}

func (h *Handler) createChat(name string) (*model.Chat, error) {
	chat := &model.Chat{
		Name: name,
	}

	if err := h.store.DB.Create(chat).Error; err != nil {
		return nil, errors.Wrap(err, "failed to create chat")
	}

	return chat, nil
}
