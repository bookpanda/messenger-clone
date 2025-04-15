package message

import (
	"encoding/json"
	"log/slog"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/services/chat"
	"github.com/bookpanda/messenger-clone/pkg/logger"
	"github.com/gofiber/contrib/websocket"
)

func (h *Handler) HandleRealTimeMessages(c *websocket.Conn) {
	jwtEntity, ok := c.Locals(jwtEntityKey).(jwt.JWTentity)
	if !ok {
		logger.Error("failed receive userID from jwtEntity")
		return
	}

	chatID := uint(c.Locals(chatIDKey).(uint64))
	client := h.chatServer.Register(jwtEntity.ID, chatID)
	if client == nil {
		logger.Error("failed to register client")
		c.Close()
		return
	}

	var wg sync.WaitGroup
	wg.Add(2)

	// server receives from sender client
	go h.receiveRealtimeMessage(&wg, c, jwtEntity.ID, chatID)
	// server sends to receiver client
	go h.sendRealtimeMessage(&wg, c, jwtEntity.ID, chatID, client)

	wg.Wait()
	c.Close()
}

func (h *Handler) receiveRealtimeMessage(wg *sync.WaitGroup, c *websocket.Conn, senderID uint, chatID uint) {
	defer wg.Done()

	for {
		msgType, msg, err := c.ReadMessage()
		if err != nil {
			logger.Error("failed receiving message", slog.Any("error", err))
			logger.Info("closing connection...")
			h.chatServer.Logout(senderID, chatID)
			break
		}

		errorMsg := dto.SendRealtimeMessageRequest{
			EventType: dto.EventError,
			Content:   "invalid message",
		}

		var msgReq dto.SendRealtimeMessageRequest
		if err := json.Unmarshal([]byte(msg), &msgReq); err != nil {
			logger.Error("Failed Unmarshal json", slog.Any("error", err))
			h.chatServer.BroadcastToRoom(errorMsg, chatID, senderID)
			continue
		}

		if err := h.validate.Struct(msgReq); err != nil {
			logger.Error("Failed validate message request", slog.Any("error", err))
			h.chatServer.BroadcastToRoom(errorMsg, chatID, senderID)
			continue
		}

		if !dto.ValidateEventType(msgReq.EventType.String()) {
			logger.Error("Invalid event type", slog.Any("event_type", msgReq.EventType))
			h.chatServer.BroadcastToRoom(errorMsg, chatID, senderID)
			continue
		}

		// msgType is from lib, not same as our EventType
		if msgType == websocket.TextMessage {
			h.chatServer.BroadcastToRoom(msgReq, chatID, senderID)
		}

		// create Message object in database
		req := dto.SendMessageRequest{
			Content: msgReq.Content,
			ChatID:  chatID,
		}
		h.SendMessage(req, senderID)
	}
}

func (h *Handler) sendRealtimeMessage(wg *sync.WaitGroup, c *websocket.Conn, receiverID uint, chatID uint, client *chat.Client) {
	defer wg.Done()

	for {
		select {
		case <-client.Terminate:
			return
		case msg := <-client.Message:
			if err := c.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
				logger.Error("failed sending message", slog.Any("error", err))
				logger.Info("closing connection...")
				h.chatServer.Logout(receiverID, chatID)
				return
			}
		}
	}
}
