package chat

import (
	"encoding/json"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/database"
	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/go-playground/validator/v10"
	"github.com/pkg/errors"
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
	// TODO: check if user is actually member of the chat
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

func (s *Server) BroadcastToRoom(msgReq dto.SendRealtimeMessageRequest, chatID uint, senderID uint) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// assign senderID so that frontend app knows who sent the message
	// also cannot trust the client to send senderID (identity spoofing)
	msgReq.SenderID = senderID

	json, err := json.Marshal(msgReq)
	if err != nil {
		return errors.Wrap(err, "failed Marshal to json")
	}

	// if event is error, send to sender only
	if msgReq.EventType == dto.EventError {
		client := s.chats[chatID][msgReq.SenderID]
		if client != nil {
			client.Message <- string(json)
		}
		return nil
	}

	// if event is message, send to all other clients in the chat
	for _, client := range s.chats[chatID] {
		if client == nil || client.Terminate == nil || client.UserID == msgReq.SenderID {
			// skip nil clients or the sender
			continue
		}

		client.Message <- string(json)
	}

	return nil
}
