package auth

import (
	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/go-playground/validator/v10"
	"golang.org/x/oauth2"
)

type Handler struct {
	store      *database.Store
	validate   *validator.Validate
	jwtService *jwt.JWT
	// authmiddleware authentication.AuthMiddleware
	oauthConfig *oauth2.Config
}

func NewHandler(store *database.Store, validate *validator.Validate, jwtService *jwt.JWT,
	authmiddleware authentication.AuthMiddleware,
	oauthConfig *oauth2.Config) *Handler {

	return &Handler{
		store:      store,
		validate:   validate,
		jwtService: jwtService,
		// authmiddleware: authmiddleware,
		oauthConfig: oauthConfig,
	}
}
