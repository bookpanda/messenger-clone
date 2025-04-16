package dto

type TokenResponse struct {
	AccessToken  string `json:"accessToken" validate:"required"`
	RefreshToken string `json:"refreshToken" validate:"required"`
	Exp          int64  `json:"exp" validate:"required"`
}

type RegisterRequest struct {
	Provider string `json:"provider" validate:"required,provider"` // GOOGLE
	IDToken  string `json:"idToken" validate:"required"`
}

type RegisterResponse struct {
	TokenResponse
	User UserResponse `json:"user"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}

type LoginRequest struct {
	Provider string `json:"provider" validate:"required,provider"` // GOOGLE
	IDToken  string `json:"idToken" validate:"required"`
}

type LoginResponse struct {
	TokenResponse
	User UserResponse `json:"user" validate:"required"`
}

type GetGoogleLoginUrlResponse struct {
	Url string `json:"url"`
}
