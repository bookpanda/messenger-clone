package chat

import (
	"encoding/json"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
)

type Client struct {
	Message   chan string
	Terminate chan bool
	UserID    uint
}

type Server struct {
	users    map[uint]*Client // userID -> Client
	store    *database.Store
	validate *validator.Validate
	mu       sync.RWMutex
}

var (
	instance *Server
	once     sync.Once
)

func NewServer(store *database.Store, validate *validator.Validate) *Server {
	once.Do(func() {
		instance = &Server{
			users:    make(map[uint]*Client),
			store:    store,
			validate: validate,
			mu:       sync.RWMutex{},
		}
	})

	return instance
}

func (s *Server) Register(userID uint) *Client {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.users[userID]; exists {
		return nil
	}

	client := &Client{
		Message:   make(chan string),
		Terminate: make(chan bool),
		UserID:    userID,
	}

	s.users[userID] = client
	return client
}

func (s *Server) Logout(userID uint) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if client, exists := s.users[userID]; exists {
		client.Terminate <- true
		delete(s.users, userID)
	}
}

func (s *Server) BroadcastToRoom(eventType dto.EventType, chatID uint, senderID uint, messageID *uint, content string) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	broadcastMessage := dto.SendRealtimeMessageRequest{
		EventType: eventType,
		Content:   content,
		SenderID:  senderID,
		ChatID:    chatID,
	}

	if messageID != nil {
		broadcastMessage.MessageID = *messageID
	}

	// Marshal message to JSON
	jsonMsg, err := json.Marshal(broadcastMessage)
	if err != nil {
		return errors.Wrap(err, "failed to marshal message to JSON")
	}

	// If it's an error event, send to sender only
	if eventType == dto.EventError {
		if client, ok := s.users[senderID]; ok && client != nil {
			client.Message <- string(jsonMsg)
		}
		return nil
	}

	// Fetch chat participants
	var chat model.Chat
	err = s.store.DB.Preload("Participants").First(&chat, chatID).Error
	if err != nil {
		return errors.Wrap(err, "failed to load chat participants")
	}

	// Send to participants (either all or exclude sender depending on event type)
	for _, participant := range chat.Participants {
		client, ok := s.users[participant.ID]
		if !ok || client == nil {
			continue
		}

		// For certain events, skip sender
		// if (eventType == dto.EventStillActive || eventType == dto.EventRead) && participant.ID == senderID {
		// 	continue
		// }

		client.Message <- string(jsonMsg)
	}

	return nil
}

func (s *Server) SendToUser(eventType dto.EventType, chatID uint, senderID uint, receiverID uint, messageID *uint, content string, emojiAction string) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Don't notify the sender themselves
	if receiverID == senderID {
		return nil
	}

	client, exists := s.users[receiverID]
	if !exists || client == nil {
		return nil
	}

	// Build the realtime message
	msg := dto.SendRealtimeMessageRequest{
		EventType: eventType,
		Content:   content,
		SenderID:  senderID,
		ChatID:    chatID,
	}
	if messageID != nil {
		msg.MessageID = *messageID
	}
	if emojiAction != "" {
		msg.EmojiAction = emojiAction
	}

	// Marshal and send
	jsonMsg, err := json.Marshal(msg)
	if err != nil {
		return errors.Wrap(err, "failed to marshal message")
	}

	client.Message <- string(jsonMsg)
	return nil
}
