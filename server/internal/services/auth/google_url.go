package auth

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/gofiber/fiber/v2"
)

// @Summary			Login
// @Description		Login
// @Tags			auth
// @Router			/api/v1/auth/login [POST]
// @Param 			RequestBody 	body 	dto.LoginRequest 	true 	"request request"
// @Success			200	{object}	dto.HttpResponse[dto.LoginResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleGetGoogleLoginUrl(c *fiber.Ctx) error {
	_, cancel := context.WithTimeout(c.UserContext(), 5*time.Second)
	defer cancel()

	result := dto.GetGoogleLoginUrlResponse{
		Url: "",
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.GetGoogleLoginUrlResponse]{
		Result: result,
	})
}
