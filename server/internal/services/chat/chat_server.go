package chat

import (
	"fmt"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/database"
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

func (s *Server) BroadcastToRoom(event EventType, chatID uint, msg string, senderID uint) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	msg = fmt.Sprintf("%s %s", event, msg)

	// if event is error, send to sender only
	if event == EventError {
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
