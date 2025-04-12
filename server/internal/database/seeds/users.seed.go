package seeds

import (
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
	"gorm.io/gorm"
)

var Users = []model.User{{
	Model: gorm.Model{
		ID:        1,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	},
	Name:              "John Doe",
	Email:             "johndoe@gmail.com",
	ProfilePictureURL: "https://avatar.iran.liara.run/username?username=John+Doe",
}}
