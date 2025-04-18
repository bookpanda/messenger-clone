package chat

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/internal/utils"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// @Summary			Modify participants
// @Description		Add/remove participants to/from chat
// @Tags			chat
// @Router			/api/v1/chat/{id}/participants [PATCH]
// @Security		ApiKeyAuth
// @Param 			RequestBody 	body 	dto.ModifyParticipantRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.ModifyParticipantResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleModifyParticipants(c *fiber.Ctx) error {
	_, cancel := context.WithTimeout(c.UserContext(), time.Second*5)
	defer cancel()

	req := new(dto.ModifyParticipantRequest)
	if err := c.BodyParser(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	if !dto.ValidateParticipantAction(req.Action) {
		return apperror.BadRequest("invalid action", errors.New("action must be ADD or REMOVE"))
	}

	req.Participants = utils.RemoveDuplicates(req.Participants)
	participants, err := h.VerifyParticipants(req.Participants)
	if err != nil {
		return apperror.BadRequest("some participants not found", err)
	}

	chatID, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return apperror.BadRequest("invalid chat id", err)
	}
	finalParticipants, apperr := h.ModifyParticipants(dto.ParticipantAction(req.Action), uint(chatID), participants)
	if apperr != nil {
		return apperr
	}

	result := dto.ModifyParticipantResponse{
		Participants: dto.ToParticipantResponseList(finalParticipants),
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.ModifyParticipantResponse]{
		Result: result,
	})
}

func (h *Handler) VerifyParticipants(participants []string) ([]model.User, error) {
	// check participants exist
	var participantUsers []model.User
	if err := h.store.DB.Where("id IN ?", participants).Find(&participantUsers).Error; err != nil {
		return nil, errors.Wrap(err, "failed to find participants")
	}

	if len(participantUsers) != len(participants) {
		// check which participants not found
		foundIDs := make(map[string]struct{}, len(participants))
		for _, p := range participantUsers {
			idStr := strconv.FormatUint(uint64(p.ID), 10)
			foundIDs[idStr] = struct{}{}
		}

		var notFound []string
		for _, id := range participants {
			if _, ok := foundIDs[id]; !ok {
				notFound = append(notFound, id)
			}
		}

		return nil, errors.New("participants not found: " + strings.Join(notFound, ", "))
	}

	return participantUsers, nil
}

func (h *Handler) ModifyParticipants(action dto.ParticipantAction, chatID uint, participants []model.User) ([]model.ChatParticipant, error) {
	var chat model.Chat
	if err := h.store.DB.Preload("Participants.User").First(&chat, chatID).Error; err != nil {
		return nil, apperror.Internal("failed to load chat participants", err)
	}

	existingMap := make(map[uint]struct{})
	for _, cp := range chat.Participants {
		existingMap[cp.UserID] = struct{}{}
	}

	var conflictIDs []string
	for _, p := range participants {
		_, exists := existingMap[p.ID]
		if action == dto.AddParticipant && exists {
			conflictIDs = append(conflictIDs, strconv.FormatUint(uint64(p.ID), 10))
		}
		if action == dto.RemoveParticipant && !exists {
			conflictIDs = append(conflictIDs, strconv.FormatUint(uint64(p.ID), 10))
		}
	}
	if len(conflictIDs) > 0 {
		var msg string
		if action == dto.AddParticipant {
			msg = "participants already in chat: "
		} else {
			msg = "participants not in chat: "
		}
		return nil, apperror.BadRequest("conflict in participants", errors.New(msg+strings.Join(conflictIDs, ", ")))
	}

	// Perform DB write
	switch action {
	case dto.AddParticipant:
		for _, p := range participants {
			cp := model.ChatParticipant{
				ChatID: chatID,
				UserID: p.ID,
			}
			if err := h.store.DB.Create(&cp).Error; err != nil {
				return nil, apperror.Internal("failed to add participant", err)
			}
		}
	case dto.RemoveParticipant:
		for _, p := range participants {
			if err := h.store.DB.
				Where("chat_id = ? AND user_id = ?", chatID, p.ID).
				Delete(&model.ChatParticipant{}).Error; err != nil {
				return nil, apperror.Internal("failed to remove participant", err)
			}
		}
	default:
		return nil, apperror.BadRequest("invalid action", errors.New("action must be ADD or REMOVE"))
	}

	// Reload updated ChatParticipants with User info
	var updatedParticipants []model.ChatParticipant
	if err := h.store.DB.
		Preload("User").
		Where("chat_id = ?", chatID).
		Find(&updatedParticipants).Error; err != nil {
		return nil, apperror.Internal("failed to reload participants", err)
	}

	return updatedParticipants, nil
}
