package user

import (
	"github.com/cockroachdb/errors"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/gofiber/fiber/v2"
)

// @Summary			Get people
// @Description		Get all users except me
// @Tags			user
// @Router			/api/v1/user/people [GET]
// @Security		ApiKeyAuth
// @Success			200	{object}	dto.HttpListResponse[dto.UserResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			401	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetPeople(c *fiber.Ctx) error {
	ctx := c.UserContext()

	userID, err := h.authMiddleware.GetUserIDFromContext(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get user id from context")
	}

	// Step 1: Get user IDs who share a **direct chat** with current user
	var connectedUserIDs []uint
	err = h.store.DB.
		Raw(`
			SELECT DISTINCT cp2.user_id
			FROM chat_participants cp1
			JOIN chat_participants cp2 ON cp1.chat_id = cp2.chat_id
			JOIN chats ON chats.id = cp1.chat_id
			WHERE cp1.user_id = ?
			  AND cp2.user_id != ?
			  AND chats.is_direct = true
		`, userID, userID).
		Scan(&connectedUserIDs).Error
	if err != nil {
		return apperror.Internal("failed to get direct chat users", err)
	}

	// Step 2: Get users who are NOT in direct chat with me and not me
	var users []model.User
	query := h.store.DB.Model(&model.User{}).Where("id != ?", userID)
	if len(connectedUserIDs) > 0 {
		query = query.Where("id NOT IN ?", connectedUserIDs)
	}
	err = query.Find(&users).Error
	if err != nil {
		return apperror.Internal("failed to get users", err)
	}

	// Step 3: Return user response
	response := dto.ToUserResponseList(users)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.UserResponse]{
		Result: response,
	})
}
