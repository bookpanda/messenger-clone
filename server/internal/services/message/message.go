package message

import (
	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/bookpanda/messenger-clone/internal/services/chat"
	"github.com/go-playground/validator/v10"
)

type Handler struct {
	store          *database.Store
	chatServer     *chat.Server
	validate       *validator.Validate
	authMiddleware authentication.AuthMiddleware
}

func NewHandler(store *database.Store, validate *validator.Validate,
	authMiddleware authentication.AuthMiddleware) *Handler {
	return &Handler{
		store:          store,
		chatServer:     chat.NewServer(store, validate),
		validate:       validate,
		authMiddleware: authMiddleware,
	}
}
