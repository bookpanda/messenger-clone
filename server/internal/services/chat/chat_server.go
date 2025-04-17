package chat

import (
	"encoding/json"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/model"
	"github.com/bookpanda/messenger-clone/pkg/logger"
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

	go s.BroadcastOnlineUsers()

	return client
}

func (s *Server) Logout(userID uint) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if client, exists := s.users[userID]; exists {
		client.Terminate <- true
		delete(s.users, userID)
	}

	go s.BroadcastOnlineUsers()
}

func (s *Server) BroadcastOnlineUsers() {
	users, err := s.GetOnlineUsers()
	if err != nil {
		logger.Error("failed to get online users", err)
		return
	}

	userList := dto.ToUserResponseList(users)
	jsonPayload, err := json.Marshal(userList)
	if err != nil {
		logger.Error("failed to marshal online user list", err)
		return
	}

	if err := s.BroadcastToAll(dto.EventOnlineUsers, string(jsonPayload)); err != nil {
		logger.Error("failed to broadcast online users", err)
	}
}

func (s *Server) GetOnlineUsers() ([]model.User, error) {
	// 1. Get list of currently connected user IDs
	userIDs := make([]uint, 0, len(s.users))
	for userID := range s.users {
		userIDs = append(userIDs, userID)
	}

	if len(userIDs) == 0 {
		return nil, nil // no one to notify
	}

	// 2. Query their public info from DB
	var users []model.User
	if err := s.store.DB.
		Select("id", "name", "profile_picture_url").
		Where("id IN ?", userIDs).
		Find(&users).Error; err != nil {
		return nil, errors.Wrap(err, "failed to load user info for broadcast")
	}

	return users, nil
}

func (s *Server) BroadcastToAll(eventType dto.EventType, content string) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	message := dto.SendRealtimeMessageRequest{
		EventType: eventType,
		Content:   content,
	}

	jsonMsg, err := json.Marshal(message)
	if err != nil {
		return errors.Wrap(err, "failed to marshal broadcast message")
	}

	for _, client := range s.users {
		if client != nil {
			client.Message <- string(jsonMsg)
		}
	}

	return nil
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
