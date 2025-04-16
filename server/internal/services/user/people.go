package user

import (
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/cockroachdb/errors"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
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

	var users []model.User
	err = h.store.DB.Model(&model.User{}).Where("id != ?", userID).Find(&users).Error
	if err != nil {
		return apperror.Internal("failed to get user", err)
	}

	response := dto.ToUserResponseList(users)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.UserResponse]{
		Result: response,
	})
}
