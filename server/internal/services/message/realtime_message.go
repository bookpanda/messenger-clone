package message

import (
	"log/slog"
	"sync"

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

	chatID, ok := c.Locals(chatIDKey).(uint)
	if !ok {
		logger.Error("failed receive chatID from context")
		return
	}

	client := h.chatServer.Register(jwtEntity.ID, chatID)

	var wg sync.WaitGroup
	wg.Add(2)

	go h.receiveRealtimeMessage(&wg, c, jwtEntity.ID, chatID)
	go h.sendRealtimeMessage(&wg, c, jwtEntity.ID, chatID, client)

	wg.Wait()
	c.Close()
}

func (h *Handler) receiveRealtimeMessage(wg *sync.WaitGroup, c *websocket.Conn, userID uint, chatID uint) {
	defer wg.Done()

	for {
		msgType, msg, err := c.ReadMessage()
		if err != nil {
			logger.Error("failed receiving message", slog.Any("error", err))
			logger.Info("closing connection...")
			h.chatServer.Logout(userID, chatID)
			break
		}

		if msgType == websocket.TextMessage {
			h.chatServer.SendRawString(chatID, string(msg), userID)
		}
	}
}

func (h *Handler) sendRealtimeMessage(wg *sync.WaitGroup, c *websocket.Conn, userID uint, chatID uint, client *chat.Client) {
	defer wg.Done()

	for {
		select {
		case <-client.Terminate:
			return
		case msg := <-client.Message:
			if err := c.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
				logger.Error("failed sending message", slog.Any("error", err))
				logger.Info("closing connection...")
				h.chatServer.Logout(userID, chatID)
				return
			}
		}
	}
}
