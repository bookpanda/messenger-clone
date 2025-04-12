package seeds

import (
	"log"

	"github.com/bookpanda/messenger-clone/internal/model"
	"gorm.io/gorm"
)

func Execute(db *gorm.DB) error {
	log.Println("Running seeder...")

	userCount := 0
	for _, user := range Users {
		result := db.Model(&model.User{}).FirstOrCreate(&user)
		if result.Error != nil {
			log.Printf("Failed to seed user: %v\n", result.Error)
			return result.Error
		}
		if result.RowsAffected > 0 {
			userCount++
		}
	}
	log.Printf("Seeded %d users\n", userCount)

	log.Println("All seeder done")
	return nil
}
