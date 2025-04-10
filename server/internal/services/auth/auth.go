package auth

import (
	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/go-playground/validator/v10"
)

type Handler struct {
	store      *database.Store
	validate   *validator.Validate
	jwtService *jwt.JWT
	// authmiddleware authentication.AuthMiddleware
	googleClientID string
}

func NewHandler(store *database.Store, validate *validator.Validate, jwtService *jwt.JWT,
	authmiddleware authentication.AuthMiddleware,
	googleClientID string) *Handler {
	return &Handler{
		store:      store,
		validate:   validate,
		jwtService: jwtService,
		// authmiddleware: authmiddleware,
		googleClientID: googleClientID,
	}
}
