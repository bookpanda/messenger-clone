package storage

import (
	"context"
)

type Config struct {
	URL    string `env:"URL"`
	Secret string `env:"SECRET"`
	Bucket string `env:"BUCKET"`
}

type Client struct {
	// Client *storage_go.Client
	config Config
}

func New(ctx context.Context, config Config) (*Client, error) {
	// client, err := supabase.NewClient(config.URL, config.Secret, nil)
	// if err != nil {
	// 	return nil, errors.Wrap(err, "failed to new Supabase client")
	// }

	return &Client{
		// Client: client.Storage,
		config: config,
	}, nil
}
