package seeds

import (
	"log"

	"github.com/bookpanda/messenger-clone/internal/model"
	"gorm.io/gorm"
)

func Execute(db *gorm.DB, modelName string) error {
	if modelName == "messages" {
		log.Println("Seeding messages...")
		if err := seedMessages(db); err != nil {
			return err
		}
		return nil
	}
	log.Println("Running seeder...")

	var count int
	var err error
	if count, err = seedModel(db, &model.User{}, toInterfaceSlice(Users)); err != nil {
		return err
	}
	log.Printf("Seeded %d users\n", count)

	if count, err = seedModel(db, &model.Chat{}, toInterfaceSlice(Chats)); err != nil {
		return err
	}
	log.Printf("Seeded %d chats\n", count)

	err = seedMessages(db)
	if err != nil {
		return err
	}

	log.Println("All seeder done")
	return nil
}

func seedModel(db *gorm.DB, model interface{}, data []interface{}) (int, error) {
	count := 0
	for _, item := range data {
		result := db.Model(model).Create(item)
		if result.Error != nil {
			log.Printf("Failed to seed %T: %v\n", model, result.Error)
			return 0, result.Error
		}
		if result.RowsAffected > 0 {
			count++
		}
	}

	return count, nil
}

func toInterfaceSlice[T any](items []T) []interface{} {
	result := make([]interface{}, len(items))
	for i, v := range items {
		result[i] = &v
	}
	return result
}

func seedMessages(db *gorm.DB) error {
	var chats []model.Chat
	err := db.Preload("Participants").Find(&chats).Error
	if err != nil {
		return err
	}

	var count int
	messages := GenerateMessagesForChats(chats)
	if count, err = seedModel(db, &model.Message{}, toInterfaceSlice(messages)); err != nil {
		return err
	}
	log.Printf("Seeded %d messages\n", count)

	// Create inbox entries for each message
	for _, message := range messages {
		var inboxes []model.Inbox
		for _, participant := range message.Chat.Participants {
			if participant.ID == message.SenderID {
				continue
			}
			inbox := model.Inbox{
				MessageID: message.ID,
				UserID:    participant.ID,
			}
			inboxes = append(inboxes, inbox)
		}
		if len(inboxes) > 0 {
			if err := db.Create(&inboxes).Error; err != nil {
				return err
			}
		}
	}
	log.Printf("Seeded %d inbox entries\n", len(messages))

	return nil
}
