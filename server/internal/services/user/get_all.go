package user

import (
	"github.com/bookpanda/messenger-clone/pkg/apperror"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/gofiber/fiber/v2"
)

// @Summary			Get all users
// @Description		Get all users
// @Tags			user
// @Router			/api/v1/user [GET]
// @Security		ApiKeyAuth
// @Success			200	{object}	dto.HttpListResponse[dto.UserResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetAllUsers(c *fiber.Ctx) error {

	var users []model.User
	err := h.store.DB.Model(&model.User{}).Find(&users).Error
	if err != nil {
		return apperror.Internal("failed to get user", err)
	}

	response := dto.ToUserResponseList(users)

	return c.Status(fiber.StatusOK).JSON(dto.HttpListResponse[dto.UserResponse]{
		Result: response,
	})
}
