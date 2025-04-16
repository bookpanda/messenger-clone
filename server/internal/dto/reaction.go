package dto

import (
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
)

type ReactionResponse struct {
	ID        uint      `json:"id" binding:"required" validate:"required"`
	Emoji     string    `json:"emoji" binding:"required" validate:"required"`
	MessageID uint      `json:"message_id" binding:"required" validate:"required"`
	SenderID  uint      `json:"sender_id" binding:"required" validate:"required"`
	CreatedAt time.Time `json:"created_at" binding:"required" validate:"required"`
}

func ToReactionResponse(reaction model.Reaction) ReactionResponse {
	return ReactionResponse{
		ID:        reaction.ID,
		Emoji:     reaction.Emoji,
		MessageID: reaction.MessageID,
		SenderID:  reaction.SenderID,
		CreatedAt: reaction.CreatedAt,
	}
}

func ToReactionResponseList(reactions []model.Reaction) []ReactionResponse {
	reactionResponses := make([]ReactionResponse, len(reactions))
	for i, reaction := range reactions {
		reactionResponses[i] = ToReactionResponse(reaction)
	}
	return reactionResponses
}
