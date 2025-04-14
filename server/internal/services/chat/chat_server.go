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

func (s *Server) SendRawString(chatID uint, msg string, senderID uint) {
	var msgReq dto.SendMessageRequest
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

	// msgModel := dto.ToMessageModel(senderID, msgReq)
	// if msgModel.ReceiverID == senderID {
	// 	logger.Error("cannot send message to yourself")
	// 	s.broadcastToRoom(EventError, chatID, "cannot send message to yourself", senderID)
	// 	return
	// }

	// if err := c.store.DB.Create(&msgModel).Error; err != nil {
	// 	logger.Error("failed inserting message to database", slog.Any("error", err))
	// 	c.sendMessage(EventError, senderID, "internal error")
	// 	return
	// }

	// json, err := json.Marshal(dto.ToRealTimeMessageResponse(msgModel))
	// if err != nil {
	// 	logger.Error("failed Marshal realtime message response to json", slog.Any("error", err))
	// 	c.sendMessage(EventError, senderID, "internal error")
	// 	return
	// }

	s.broadcastToRoom(EventMessage, chatID, msg, senderID)
	// c.sendMessage(EventMessage, msgModel.ReceiverID, string(json))
	// c.sendMessage(EventMessage, msgModel.SenderID, string(json))
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
