package seeds

import (
	"github.com/bookpanda/messenger-clone/internal/model"
)

var Chats = []model.Chat{
	{
		Name: "Group 1",
		Participants: []model.ChatParticipant{
			{UserID: 1},
			{UserID: 2},
			{UserID: 3},
		},
	},
	{
		Name: "Group 2",
		Participants: []model.ChatParticipant{
			{UserID: 4},
			{UserID: 5},
			{UserID: 6},
		},
	},
	{
		Name: "Group 3",
		Participants: []model.ChatParticipant{
			{UserID: 1},
			{UserID: 3},
			{UserID: 5},
		},
	},
}
