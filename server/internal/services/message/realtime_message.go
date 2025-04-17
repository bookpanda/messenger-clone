package message

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"sync"

	"github.com/bookpanda/messenger-clone/internal/dto"
	"github.com/bookpanda/messenger-clone/internal/jwt"
	"github.com/bookpanda/messenger-clone/internal/model"
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
	userID := jwtEntity.ID

	chatID := uint(c.Locals(chatIDKey).(uint64))
	client := h.chatServer.Register(userID, chatID)
	if client == nil {
		logger.Error("failed to register client")
		c.Close()
		return
	}

	var wg sync.WaitGroup
	wg.Add(2)

	// server receives from client
	go h.receiveRealtimeMessage(&wg, c, userID, chatID)
	// server sends to client
	go h.sendRealtimeMessage(&wg, c, userID, chatID, client)

	// sending unread messages
	var unreadMessages []model.Message
	err := h.store.DB.Model(&model.Message{}).
		Joins("JOIN inboxes ON inboxes.message_id = messages.id").
		Where("messages.chat_id = ? AND inboxes.user_id = ? AND inboxes.deleted_at IS NULL", chatID, userID).
		Preload("Reactions").
		Find(&unreadMessages).Error
	if err != nil {
		logger.Error("failed to load unread messages", err)
		return
	}

	logger.Info(fmt.Sprintf("User %d has %d unread messages", userID, len(unreadMessages)))
	var messageIDs []uint
	for _, message := range unreadMessages {
		msgReq := dto.SendRealtimeMessageRequest{
			EventType: dto.EventUnreadMessage,
			Content:   message.Content,
			MessageID: message.ID,
			SenderID:  message.SenderID,
		}
		json, err := json.Marshal(msgReq)
		if err != nil {
			return
		}
		logger.Info(fmt.Sprintf("Sending unread message %d to user %d", message.ID, userID))
		client.Message <- string(json)
		messageIDs = append(messageIDs, message.ID)
	}

	// delete inboxes (mark as deleted)
	if len(messageIDs) > 0 {
		err := h.store.DB.
			Where("user_id = ? AND message_id IN ?", userID, messageIDs).
			Delete(&model.Inbox{}).Error
		if err != nil {
			logger.Error("failed to delete inbox entries", err)
			return
		}
	}

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

		// logger.Info("receive message", msgReq)

		// create Message object in database, then send to all clients
		if msgReq.EventType == dto.EventMessage {
			req := dto.SendMessageRequest{
				Content: msgReq.Content,
				ChatID:  chatID,
			}
			message, err := h.SendMessage(req, senderID)
			if err != nil {
				logger.Error("failed to send message", slog.Any("error", err))
				h.chatServer.BroadcastToRoom(errorMsg, chatID, senderID)
				continue
			}

			msgReq.MessageID = message.ID
			// msgType is from lib, not same as our EventType
			if msgType == websocket.TextMessage {
				h.chatServer.BroadcastToRoom(msgReq, chatID, senderID)
			}

			continue
		}

		// sender (receiver of message) has read
		if msgReq.EventType == dto.EventRead {
			err := h.store.DB.
				Where("message_id = ? AND user_id = ?", msgReq.MessageID, senderID).
				Delete(&model.Inbox{}).Error
			if err != nil {
				logger.Error("failed to delete inbox", slog.Any("error", err))
				h.chatServer.BroadcastToRoom(errorMsg, chatID, senderID)
			}
			h.chatServer.BroadcastToRoom(msgReq, chatID, senderID)
			continue
		}

		if msgReq.EventType == dto.EventStillActive {
			h.chatServer.BroadcastToRoom(msgReq, chatID, senderID)
			continue
		}

		// for other events, just send to all clients
		if msgType == websocket.TextMessage {
			h.chatServer.BroadcastToRoom(msgReq, chatID, senderID)
		}
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
