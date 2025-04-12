package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Provider string

const (
	ProviderUnknown Provider = ""
	ProviderGoogle  Provider = "GOOGLE"
)

func (p Provider) String() string {
	return string(p)
}

func ValidateProvider(provider string) bool {
	switch Provider(provider) {
	case ProviderGoogle:
		return true
	}
	return false
}

type Token struct {
	AccessToken  string
	RefreshToken string
	Exp          int64
}

type CachedTokens struct {
	AccessUID  uuid.UUID
	RefreshUID uuid.UUID
}

type User struct {
	gorm.Model
	Name              string `gorm:"not null"`
	Email             string `gorm:"not null;unique"`
	ProfilePictureURL string
}
