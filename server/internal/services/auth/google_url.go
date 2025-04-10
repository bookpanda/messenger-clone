package auth

import (
	"context"
	"time"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
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

	// TODO: Generate a random state and store it in redis
	state := "some-random-state"
	url := h.oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)

	result := dto.GetGoogleLoginUrlResponse{
		Url: url,
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.GetGoogleLoginUrlResponse]{
		Result: result,
	})
}
