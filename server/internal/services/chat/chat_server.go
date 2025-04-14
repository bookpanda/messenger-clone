package chat

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	"github.com/go-playground/validator/v10"
)

type EventType string

const (
	EventError   EventType = "ERROR"
	EventMessage EventType = "MESSAGE"
)

type Client struct {
	Message   chan string
	Terminate chan bool
	UserID    uint
}

type Server struct {
	chats    map[uint]map[uint]*Client
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
			store:    store,
			validate: validate,
			chats:    make(map[uint]map[uint]*Client),
			mu:       sync.RWMutex{},
		}
	})

	return instance
}

func (s *Server) Register(userID uint, chatID uint) *Client {
	s.mu.Lock()
	defer s.mu.Unlock()

	client := &Client{
		Message:   make(chan string),
		Terminate: make(chan bool),
		UserID:    userID,
	}

	if s.chats[chatID] == nil {
		s.chats[chatID] = make(map[uint]*Client)
	}
	s.chats[chatID][userID] = client

	return client
}

func (s *Server) Logout(userID uint, chatID uint) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if clients, ok := s.chats[chatID]; ok {
		if client, exists := clients[userID]; exists {
			client.Terminate <- true
			delete(clients, userID) // remove client from chat

			if len(clients) == 0 {
				delete(s.chats, chatID) // clean up empty chat
			}
		}
	}
}

// msg is a raw JSON string
func (s *Server) SendToChat(chatID uint, msg string, senderID uint) {
	var msgReq dto.SendRealtimeMessageRequest
	if err := json.Unmarshal([]byte(msg), &msgReq); err != nil {
		logger.Error("Failed Unmarshal json", slog.Any("error", err))
		s.broadcastToRoom(EventError, chatID, "invalid message", senderID)
		return
	}

	if err := s.validate.Struct(msgReq); err != nil {
		logger.Error("Failed validate message request", slog.Any("error", err))
		s.broadcastToRoom(EventError, chatID, "invalid message", senderID)
		return
	}

	s.broadcastToRoom(EventMessage, chatID, msg, senderID)
}

func (s *Server) broadcastToRoom(event EventType, chatID uint, msg string, senderID uint) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	msg = fmt.Sprintf("%s %s", event, msg)

	if event == EventError { // if event is error, send to sender only
		client := s.chats[chatID][senderID]
		if client != nil {
			client.Message <- msg
		}
		return
	}

	// if event is message, send to all other clients in the chat
	for _, client := range s.chats[chatID] {
		if client == nil || client.Terminate == nil || client.UserID == senderID {
			// skip nil clients or the sender
			continue
		}

		client.Message <- msg
	}
}
