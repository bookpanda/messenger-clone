package dto

import "github.com/bookpanda/messenger-clone/internal/model"

type UserUpdateRequest struct {
	Name              string `json:"name" validate:"required"`
	ProfilePictureURL string `json:"profilePictureUrl" validate:"required"`
}

type UserResponse struct {
	ID                uint   `json:"id" validate:"required"`
	Name              string `json:"name" validate:"required"`
	Email             string `json:"email" validate:"required"`
	ProfilePictureURL string `json:"profilePictureUrl" validate:"required"`
}

func ToUserResponse(user model.User) UserResponse {
	return UserResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		ProfilePictureURL: user.ProfilePictureURL,
	}
}

func ToUserResponseList(users []model.User) []UserResponse {
	userResponses := make([]UserResponse, len(users))
	for i, user := range users {
		userResponses[i] = ToUserResponse(user)
	}
	return userResponses
}
