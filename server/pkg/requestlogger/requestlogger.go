package requestlogger

import (
	"errors"
	"fmt"
	"log/slog"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/pkg/apperror"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	"github.com/gofiber/fiber/v2"
)

func New() func(ctx *fiber.Ctx) error {
	return func(ctx *fiber.Ctx) error {
		requestID := ctx.GetRespHeader("X-Request-Id")
		err := ctx.Next()
		if err != nil {
			return handleError(ctx, err, requestID)
		}

		logger.InfoContext(ctx.UserContext(), "request received", slog.String("request_id", requestID), slog.String("method", ctx.Method()), slog.String("path", ctx.Path()), slog.Int("status", ctx.Response().StatusCode()))
		return nil
	}
}

func handleError(c *fiber.Ctx, err error, requestID string) error {
	var fiberError *fiber.Error
	if errors.As(err, &fiberError) {
		c.Set(fiber.HeaderContentType, fiber.MIMETextPlainCharsetUTF8)
		return c.Status(fiberError.Code).SendString(fiberError.Message)
	}

	status := fiber.StatusInternalServerError
	message := "internal server error"

	var appError *apperror.AppError
	if errors.As(err, &appError) {
		status = appError.Code
		message = appError.Message
	}

	logger.ErrorContext(c.UserContext(), fmt.Sprintf("%s %s %d", c.Method(), c.Path(), status), slog.Any("error", err))
	return c.Status(status).JSON(dto.HttpError{
		Error: message,
	})
}
