package config

import (
	"log"

	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/server"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	"github.com/bookpanda/messenger-clone/pkg/postgres"
	"github.com/bookpanda/messenger-clone/pkg/redis"
	"github.com/bookpanda/messenger-clone/pkg/storage"
	"github.com/caarlos0/env/v10"
	"github.com/joho/godotenv"
)

type AppConfig struct {
	Server         server.Config     `envPrefix:"SERVER_"`
	Logger         logger.Config     `envPrefix:"LOGGER_"`
	Postgres       postgres.Config   `envPrefix:"POSTGRES_"`
	Redis          redis.Config      `envPrefix:"REDIS_"`
	Cors           server.CorsConfig `envPrefix:"CORS_"`
	JWT            jwt.Config        `envPrefix:"JWT_"`
	Storage        storage.Config    `envPrefix:"STORAGE_"`
	GoogleClientID string            `env:"GOOGLE_CLIENT_ID"`
	FrontendURL    string            `env:"FRONTEND_URL"`
}

func Load() *AppConfig {
	appConfig := &AppConfig{}
	_ = godotenv.Load()

	if err := env.Parse(appConfig); err != nil {
		log.Fatalf("failed parse env: %s", err)
	}

	return appConfig
}
