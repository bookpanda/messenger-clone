package database

import (
	"context"
	"log"
	"log/slog"

	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	pglib "github.com/bookpanda/messenger-clone/pkg/postgres"
	rdlib "github.com/bookpanda/messenger-clone/pkg/redis"
	"github.com/bookpanda/messenger-clone/pkg/storage"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Store struct {
	DB      *gorm.DB
	Cache   *redis.Client
	Storage *storage.Client
}

func New(ctx context.Context, pgConfig pglib.Config, rdConfig rdlib.Config, storageConfig storage.Config) *Store {
	db, err := gorm.Open(postgres.Open(pgConfig.String()), &gorm.Config{})
	if err != nil {
		logger.PanicContext(ctx, "failed to connect to database", slog.Any("error", err))
	}

	redisConn, err := rdlib.New(ctx, rdConfig)
	if err != nil {
		logger.PanicContext(ctx, "failed to connect to redis", slog.Any("error", err))
	}

	storage, err := storage.New(ctx, storageConfig)
	if err != nil {
		logger.PanicContext(ctx, "failed to connect to storage", slog.Any("error", err))
	}

	store := &Store{
		DB:      db,
		Cache:   redisConn,
		Storage: storage,
	}
	store.migrate()
	return store
}

func (s *Store) migrate() {
	log.Println("Running migrations...")

	if err := s.DB.AutoMigrate(
		&model.User{},
		&model.Chat{},
		&model.ChatParticipant{},
		&model.Message{},
		// &model.MessageReaction{},
		&model.Inbox{},
	); err != nil {
		logger.Panic("failed to migrate database", slog.Any("error", err))
	}

	log.Println("Migrations complete!")
}
