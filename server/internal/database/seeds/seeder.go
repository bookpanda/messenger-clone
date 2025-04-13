package seeds

import (
	"log"

	"github.com/bookpanda/messenger-clone/internal/model"
	"gorm.io/gorm"
)

func Execute(db *gorm.DB) error {
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
