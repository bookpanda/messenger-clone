package seeds

import (
	"log"

	"github.com/bookpanda/messenger-clone/internal/model"
	"gorm.io/gorm"
)

func Execute(db *gorm.DB) error {
	log.Println("Running seeder...")

	if err := seedModel(db, &model.User{}, toInterfaceSlice(Users)); err != nil {
		return err
	}
	if err := seedModel(db, &model.Chat{}, toInterfaceSlice(Chats)); err != nil {
		return err
	}

	log.Println("All seeder done")
	return nil
}

func seedModel(db *gorm.DB, model interface{}, data []interface{}) error {
	chatCount := 0
	for _, item := range data {
		result := db.Model(model).Create(item)
		if result.Error != nil {
			log.Printf("Failed to seed %T: %v\n", model, result.Error)
			return result.Error
		}
		if result.RowsAffected > 0 {
			chatCount++
		}
	}

	log.Printf("Seeded %d chats\n", chatCount)
	return nil
}

func toInterfaceSlice[T any](items []T) []interface{} {
	result := make([]interface{}, len(items))
	for i, v := range items {
		result[i] = &v
	}
	return result
}
