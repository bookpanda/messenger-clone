package seeds

import (
	"github.com/bookpanda/messenger-clone/internal/model"
	"gorm.io/gorm"
)

var Chats = []model.Chat{
	{
		Name: "Group 1",
		Participants: []model.User{
			{Model: gorm.Model{ID: 1}},
			{Model: gorm.Model{ID: 2}},
			{Model: gorm.Model{ID: 3}},
		},
	},
	{
		Name: "Group 2",
		Participants: []model.User{
			{Model: gorm.Model{ID: 4}},
			{Model: gorm.Model{ID: 5}},
			{Model: gorm.Model{ID: 6}},
		},
	},
	{
		Name: "Group 3",
		Participants: []model.User{
			{Model: gorm.Model{ID: 1}},
			{Model: gorm.Model{ID: 3}},
			{Model: gorm.Model{ID: 5}},
		},
	},
}
