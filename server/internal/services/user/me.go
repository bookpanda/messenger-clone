package user

import (
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/cockroachdb/errors"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/gofiber/fiber/v2"
)

// @Summary			Get me
// @Description		Get me
// @Tags			user
// @Router			/api/v1/me [GET]
// @Security		ApiKeyAuth
// @Success			200	{object}	dto.HttpResponse[dto.UserResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetMe(c *fiber.Ctx) error {
	userID, err := h.authMiddleware.GetUserIDFromContext(c.UserContext())
	if err != nil {
		return errors.Wrap(err, "failed to get user id from context")
	}

	var user model.User
	result := h.store.DB.First(&user, userID)
	if result.Error != nil {
		return apperror.Internal("failed to get user", nil)
	}

	response := dto.UserResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		PhoneNumber:       user.PhoneNumber,
		ProfilePictureURL: user.ProfilePictureURL,
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.UserResponse]{
		Result: response,
	})
}
