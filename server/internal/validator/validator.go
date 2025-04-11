package validator

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	"github.com/go-playground/validator/v10"
)

func New() *validator.Validate {
	validate := validator.New()
	if err := validate.RegisterValidation("provider", validateString(model.ValidateProvider)); err != nil {
		logger.Panic("failed to register provider validation", err)
	}
	if err := validate.RegisterValidation("messageType", validateString(model.ValidateMessageType)); err != nil {
		logger.Panic("failed to register messageType validation", err)
	}

	return validate
}

type EnumValidator func(field string) bool

func validateString(fn EnumValidator) validator.Func {
	return func(fl validator.FieldLevel) bool {
		return fn(fl.Field().String())
	}
}
