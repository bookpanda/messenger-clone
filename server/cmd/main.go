package main

import (
	"context"
	"flag"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/bookpanda/messenger-clone/internal/config"
	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/database/seeds"
	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/bookpanda/messenger-clone/internal/server"
	"github.com/bookpanda/messenger-clone/internal/services/auth"
	"github.com/bookpanda/messenger-clone/internal/services/chat"
	"github.com/bookpanda/messenger-clone/internal/services/message"
	"github.com/bookpanda/messenger-clone/internal/services/user"
	"github.com/bookpanda/messenger-clone/internal/validator"
	"github.com/bookpanda/messenger-clone/pkg/google"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	"gorm.io/gorm"
)

func handleArgs(db *gorm.DB) {
	flag.Parse()
	args := flag.Args()

	if len(args) >= 1 {
		switch args[0] {
		case "seed":
			err := seeds.Execute(db)
			if err != nil {
				log.Fatalf("Failed to execute seed: %v", err)
			}
			os.Exit(0)
		}
	}
}

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

	handleArgs(store.DB)

	// services
	jwtService := jwt.New(config.JWT, store.Cache)
	// chatService := chat.NewServer(store, validate)

	// middlewares
	authMiddleware := authentication.NewAuthMiddleware(jwtService)

	// handlers
	authHandler := auth.NewHandler(store, validate, jwtService, authMiddleware, oauthConfig)
	chatHandler := chat.NewHandler(store, validate, authMiddleware)
	userHandler := user.NewHandler(store, validate, authMiddleware)
	messageHandler := message.NewHandler(store, validate, authMiddleware)
	// objectHandler := objects.NewHandler(store, config.Storage)

	server.RegisterDocs()

	// routes
	server.RegisterRoutes(
		authMiddleware,
		authHandler,
		userHandler,
		chatHandler,
		messageHandler,
		// objectHandler,
	)

	server.Start(ctx, stop)
}
