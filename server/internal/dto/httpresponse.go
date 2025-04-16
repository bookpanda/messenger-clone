package dto

type HttpResponse[T any] struct {
	Result T `json:"result" validate:"required"`
}

type HttpError struct {
	Error string `json:"error" validate:"required"`
}

// this struct is created to fix swaggo error with slice generic ex. HttpResponse[[]dto.something] => panic
type HttpListResponse[T any] struct {
	Result []T `json:"result" validate:"required"`
}
