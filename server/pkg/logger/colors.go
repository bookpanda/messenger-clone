package logger

import (
	"context"
	"fmt"
	"log/slog"
	"os"
)

type ColorHandler struct {
	slog.Handler
}

var (
	colorReset  = "\033[0m"
	colorRed    = "\033[31m"
	colorYellow = "\033[33m"
	colorGreen  = "\033[32m"
	colorBlue   = "\033[34m"
)

func NewColorHandler() slog.Handler {
	return &ColorHandler{Handler: slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: false})}
}

func (h *ColorHandler) Handle(ctx context.Context, r slog.Record) error {
	var color string

	switch r.Level {
	case slog.LevelDebug:
		color = colorBlue
	case slog.LevelInfo:
		color = colorGreen
	case slog.LevelWarn:
		color = colorYellow
	case slog.LevelError:
		color = colorRed
	default:
		color = colorReset
	}

	fmt.Print(color)
	err := h.Handler.Handle(ctx, r)
	fmt.Print(colorReset)

	return err
}
