package dto

import "github.com/bookpanda/messenger-clone/internal/model"

type UserUpdateRequest struct {
	Name              string `json:"name"`
	ProfilePictureURL string `json:"profilePictureUrl"`
	PhoneNumber       string `json:"phoneNumber"`
}

type UserResponse struct {
	ID                uint   `json:"id"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	PhoneNumber       string `json:"phoneNumber"`
	ProfilePictureURL string `json:"profilePictureUrl"`
}

type CustomerResponse struct {
	ID                uint   `json:"id"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	PhoneNumber       string `json:"phoneNumber"`
	ProfilePictureURL string `json:"profilePictureUrl"`
}

type PublicUserResponse struct {
	ID                uint   `json:"id"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	PhoneNumber       string `json:"phoneNumber"`
	ProfilePictureURL string `json:"profilePictureUrl"`
}

func ToUserResponse(user model.User) UserResponse {
	return UserResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		PhoneNumber:       user.PhoneNumber,
		ProfilePictureURL: user.ProfilePictureURL,
	}
}

func ToCustomerResponse(user model.User) CustomerResponse {
	return CustomerResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		PhoneNumber:       user.PhoneNumber,
		ProfilePictureURL: user.ProfilePictureURL,
	}
}

func ToPublicUserResponse(user model.User) PublicUserResponse {
	return PublicUserResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		PhoneNumber:       user.PhoneNumber,
		ProfilePictureURL: user.ProfilePictureURL,
	}
}
