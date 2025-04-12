package auth

import (
	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/go-playground/validator/v10"
)

type Handler struct {
	store    *database.Store
	validate *validator.Validate
}

func NewHandler(store *database.Store, validate *validator.Validate,
) *Handler {

	return &Handler{
		store:    store,
		validate: validate,
	}
}
