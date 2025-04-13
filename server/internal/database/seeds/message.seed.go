package seeds

import (
	"math/rand"
	"time"

	"github.com/bookpanda/messenger-clone/internal/model"
)

var sampleContents = []string{
	"Hello!", "How's it going?", "What's up?", "Nice to meet you.", "See you soon!", "Let's catch up later.", "This is a test message.",
}

func GenerateMessagesForChats(chats []model.Chat) []model.Message {
	rand.Seed(time.Now().UnixNano())
	var messages []model.Message

	for _, chat := range chats {
		numMessages := rand.Intn(38) + 3 // between 3 and 40 messages
		for i := 0; i < numMessages; i++ {
			sender := chat.Participants[rand.Intn(len(chat.Participants))]
			messages = append(messages, model.Message{
				Type:     model.MessageTypeText,
				Content:  sampleContents[rand.Intn(len(sampleContents))],
				ChatID:   chat.ID,
				SenderID: sender.ID,
			})
		}
	}

	return messages
}
