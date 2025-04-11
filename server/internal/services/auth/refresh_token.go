package auth

import (
	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/cockroachdb/errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// @Summary			Refresh Token
// @Description		Refresh Token
// @Tags			auth
// @Router			/api/v1/auth/refresh-token [POST]
// @Param 			RequestBody 	body 	dto.RefreshTokenRequest 	true 	"request request"
// @Success			200 {object}	dto.HttpResponse[dto.TokenResponse]
// @Failure			400	{object}	dto.HttpError
// @Failure			500	{object}	dto.HttpError
func (h *Handler) HandleRefreshToken(c *fiber.Ctx) error {
	ctx := c.UserContext()

	req := new(dto.RefreshTokenRequest)
	if err := c.BodyParser(&req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	if err := h.validate.Struct(req); err != nil {
		return apperror.BadRequest("invalid request body", err)
	}

	jwtEntity, err := h.jwtService.ParseToken(req.RefreshToken, true)
	if err != nil {
		return apperror.UnAuthorized("invalid token", err)
	}

	cachedToken, err := h.jwtService.GetCachedTokens(ctx, jwtEntity.ID)
	if err != nil {
		return apperror.UnAuthorized("invalid token", err)
	}

	if err := h.jwtService.ValidateToken(*cachedToken, jwtEntity, true); err != nil {
		return apperror.UnAuthorized("invalid token", err)
	}

	tokens, err := h.jwtService.GenerateAndStoreTokenPair(ctx, &model.User{
		Model: gorm.Model{ID: jwtEntity.ID},
	})
	if err != nil {
		return errors.Wrap(err, "failed to generate token pair")
	}

	return c.Status(fiber.StatusOK).JSON(dto.HttpResponse[dto.TokenResponse]{
		Result: dto.TokenResponse{
			AccessToken:  tokens.AccessToken,
			RefreshToken: tokens.RefreshToken,
			Exp:          tokens.Exp,
		},
	})
}
