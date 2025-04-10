package google

import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type Config struct {
	ClientID     string `env:"CLIENT_ID"`
	ClientSecret string `env:"CLIENT_SECRET"`
	RedirectUrl  string `env:"REDIRECT_URL"`
}

func NewConfig(config Config) *oauth2.Config {
	var googleOauthConfig = &oauth2.Config{
		ClientID:     config.ClientID,
		ClientSecret: config.ClientSecret,
		RedirectURL:  config.RedirectUrl,
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}

	return googleOauthConfig
}
