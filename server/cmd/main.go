package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/bookpanda/messenger-clone/internal/config"
	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/bookpanda/messenger-clone/internal/server"
	"github.com/bookpanda/messenger-clone/internal/services/auth"
	"github.com/bookpanda/messenger-clone/internal/validator"
	"github.com/bookpanda/messenger-clone/pkg/google"
	"github.com/bookpanda/messenger-clone/pkg/logger"
)

// @title						Messenger API
// @version						0.1
// @description					Messenger API Documentation
// @securityDefinitions.apikey ApiKeyAuth
// @in							header
// @name						Authorization
// @externalDocs.description	OpenAPI
// @externalDocs.url			https://swagger.io/resources/open-api/
func main() {
	config := config.Load()
	oauthConfig := google.NewConfig(config.Google)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	if err := logger.Init(config.Logger); err != nil {
		logger.PanicContext(ctx, "failed to initialize logger", slog.Any("error", err))
	}

	store := database.New(ctx, config.Postgres, config.Redis, config.Storage)
	server := server.New(config.Server, config.Cors, config.JWT, store)
	validate := validator.New()

	// services
	jwtService := jwt.New(config.JWT, store.Cache)
	// chatService := chat.NewServer(store, validate)

	// middlewares
	authMiddleware := authentication.NewAuthMiddleware(jwtService)

	// handlers
	authHandler := auth.NewHandler(store, validate, jwtService, authMiddleware, oauthConfig)
	// userHandler := user.NewHandler(store, validate, authMiddleware)
	// objectHandler := objects.NewHandler(store, config.Storage)
	// messageHandler := message.NewHandler(store, authMiddleware, chatService)

	server.RegisterDocs()

	// routes
	server.RegisterRoutes(
		authMiddleware,
		authHandler,
		// userHandler,
		// objectHandler,
		// messageHandler,
	)

	server.Start(ctx, stop)
}
