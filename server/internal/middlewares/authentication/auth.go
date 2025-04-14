package authentication

import (
	"context"
	"fmt"

	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/cockroachdb/errors"
	"github.com/gofiber/fiber/v2"
)

var (
	ErrInvalidToken = errors.New("INVALID_TOKEN")
)

type AuthMiddleware interface {
	Auth(ctx *fiber.Ctx) error
	GetUserIDFromContext(ctx context.Context) (uint, error)
	GetJWTEntityFromContext(ctx context.Context) (jwt.JWTentity, error)
}

type authMiddleware struct {
	jwtService *jwt.JWT
}

func NewAuthMiddleware(jwtService *jwt.JWT) AuthMiddleware {
	return &authMiddleware{
		jwtService: jwtService,
	}
}

func (r *authMiddleware) getClaims(ctx *fiber.Ctx) (jwt.JWTentity, error) {
	tokenByte := ctx.GetReqHeaders()["Authorization"]

	if len(tokenByte) == 0 {
		return jwt.JWTentity{}, apperror.UnAuthorized("UNAUTHORIZED", fmt.Errorf("no header"))
	}

	if len(tokenByte[0]) < 7 {
		return jwt.JWTentity{}, apperror.UnAuthorized("UNAUTHORIZED", fmt.Errorf("invalid header"))
	}

	bearerToken := tokenByte[0][7:]
	if len(bearerToken) == 0 {
		return jwt.JWTentity{}, apperror.UnAuthorized("UNAUTHORIZED", fmt.Errorf("no bearer keyword"))
	}

	claims, err := r.validateToken(ctx.UserContext(), bearerToken)
	if err != nil {
		return jwt.JWTentity{}, apperror.UnAuthorized("UNAUTHORIZED", errors.Wrap(err, "failed to validate token"))
	}

	return claims, nil
}

func (r *authMiddleware) Auth(ctx *fiber.Ctx) error {
	claims, err := r.getClaims(ctx)
	if err != nil {
		return errors.Wrap(err, "failed to get claims")
	}

	userContext := r.withJWTEntity(ctx.UserContext(), claims)
	ctx.SetUserContext(userContext)

	return ctx.Next()
}

func (r *authMiddleware) validateToken(ctx context.Context, bearerToken string) (jwt.JWTentity, error) {
	parsedToken, err := r.jwtService.ParseToken(bearerToken, false)
	if err != nil {
		return jwt.JWTentity{}, errors.Wrap(err, "failed to parse token")
	}

	cachedToken, err := r.jwtService.GetCachedTokens(ctx, parsedToken.ID)
	if err != nil {
		return jwt.JWTentity{}, errors.Wrap(err, "failed to get cached token")
	}

	err = r.jwtService.ValidateToken(*cachedToken, parsedToken, false)
	if err != nil {
		return jwt.JWTentity{}, errors.Wrap(err, "failed to validate token")
	}

	return parsedToken, nil

}

type jwtEntityContext struct{}

func (r *authMiddleware) withJWTEntity(ctx context.Context, jwtEntity jwt.JWTentity) context.Context {
	return context.WithValue(ctx, jwtEntityContext{}, jwtEntity)
}

func (r *authMiddleware) GetJWTEntityFromContext(ctx context.Context) (jwt.JWTentity, error) {
	jwtEntity, ok := ctx.Value(jwtEntityContext{}).(jwt.JWTentity)

	if !ok {
		return jwt.JWTentity{}, errors.New("failed to get jwt entity from context")
	}

	return jwtEntity, nil
}

func (r *authMiddleware) GetUserIDFromContext(ctx context.Context) (uint, error) {
	jwtEntity, err := r.GetJWTEntityFromContext(ctx)
	if err != nil {
		return 0, errors.Wrap(err, "failed to get jwt entity from context")
	}

	return jwtEntity.ID, nil
}
