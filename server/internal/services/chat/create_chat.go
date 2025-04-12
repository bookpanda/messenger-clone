package chat

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

// @Summary			Create chat
// @Description		Create chat with name and participants
// @Tags			chat
// @Router			/api/v1/chat [POST]
// @Param 			RequestBody 	body 	dto.CreateChatRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.CreateChatResponse]
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

	// check participants exist
	var participants []model.User
	if err := h.store.DB.Where("id IN ?", req.Participants).Find(&participants).Error; err != nil {
		return errors.Wrap(err, "failed to find participants")
	}

	if len(participants) != len(req.Participants) {
		// check which participants not found
		var notFound []string
		for _, id := range req.Participants {
			found := false
			for _, p := range participants {
				if strconv.FormatUint(uint64(p.ID), 10) == id {
					found = true
					break
				}
			}
			if !found {
				notFound = append(notFound, id)
			}
		}
		return apperror.BadRequest("some participants not found", errors.New("participants not found: "+strings.Join(notFound, ", ")))
	}

	var chat *model.Chat
	var err error

	if err := h.store.DB.Transaction(func(tx *gorm.DB) error {
		chat, err = h.createChat(req.Name)
		if err != nil {
			return errors.Wrap(err, "failed to create chat")
		}

		// create chat participants
		err = h.store.DB.Model(chat).Association("Participants").Append(participants)
		if err != nil {
			return errors.Wrap(err, "failed to add participants to chat")
		}

		return nil
	}); err != nil {
		return apperror.Internal("failed to create chat", err)
	}

	result := dto.CreateChatResponse{
		ID:           chat.ID,
		Name:         chat.Name,
		Participants: dto.ToUserResponseList(participants),
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.CreateChatResponse]{
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
