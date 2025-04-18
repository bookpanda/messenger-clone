package message

import (
	"encoding/json"
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

	client := h.chatServer.Register(userID)
	if client == nil {
		logger.Error("failed to register client")
		c.Close()
		return
	}

	var wg sync.WaitGroup
	wg.Add(2)

	// server receives from client
	go h.receiveRealtimeMessage(&wg, c, userID)
	// server sends to client
	go h.sendRealtimeMessage(&wg, c, userID, client)

	wg.Wait()
	c.Close()
}

// Warning: Do not use msgReq.SenderID
func (h *Handler) receiveRealtimeMessage(wg *sync.WaitGroup, c *websocket.Conn, senderID uint) {
	defer wg.Done()

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			logger.Error("failed receiving message", slog.Any("error", err))
			logger.Info("closing connection...")
			h.chatServer.Logout(senderID)
			break
		}

		var msgReq dto.SendRealtimeMessageRequest
		if err := json.Unmarshal([]byte(msg), &msgReq); err != nil {
			logger.Error("Failed Unmarshal json", slog.Any("error", err))
			continue
		}

		if err := h.validate.Struct(msgReq); err != nil {
			logger.Error("Failed validate message request", slog.Any("error", err))
			continue
		}

		if !dto.ValidateEventType(msgReq.EventType.String()) {
			logger.Error("Invalid event type", slog.Any("event_type", msgReq.EventType))
			continue
		}

		// All of this considered messages from SenderID

		// Case I : When user connect to server
		if msgReq.EventType == dto.EventConnect {
			// 1. Get Last message
			message, err := h.getLastMessage(msgReq.ChatID)
			if err != nil {
				logger.Error("failed to get last message", slog.Any("error", err))
			}

			// 2. Broadcast Read Event to all clients
			if message != nil {
				if err := h.chatServer.BroadcastToRoom(dto.EventRead, msgReq.ChatID, senderID, &message.ID, "read"); err != nil {
					logger.Error("failed to broadcast message", slog.Any("error", err))
				}
			}

			// 3. Broadcast new chat info to all clients in room
			chat, err := h.getChat(msgReq.ChatID)
			if err != nil {
				logger.Error("failed to get participants", slog.Any("error", err))
				continue
			}
			chatInfo := dto.ToChatResponse(chat, nil, 0)
			jsonPayload, err := json.Marshal(chatInfo)
			if err != nil {
				logger.Error("failed to marshal online user list", err)
				return
			}
			if err := h.chatServer.BroadcastToRoom(dto.EventChatInfoUpdate, msgReq.ChatID, 0, nil, string(jsonPayload)); err != nil {
				logger.Error("failed to broadcast message", slog.Any("error", err))
			}

			continue
		}

		// Case II : When user sent message in chat
		// field: EventType, Content, msgReq.SChatID
		if msgReq.EventType == dto.EventMessage {
			// 1. Store Message in database
			message, err := h.SendMessage(dto.SendMessageRequest{
				Content: msgReq.Content,
				ChatID:  msgReq.ChatID,
			}, senderID)
			if err != nil {
				logger.Error("failed to send message", slog.Any("error", err))
				continue
			}

			// 2. Broadcast to all clients
			if err := h.chatServer.BroadcastToRoom(dto.EventMessageUpdate, msgReq.ChatID, senderID, &message.ID, msgReq.Content); err != nil {
				logger.Error("failed to broadcast message", slog.Any("error", err))
			}

			continue
		}

		// Case III : When user (client) receive message then tell server that I'm read
		// field: EventType, ChatID, MessageID
		if msgReq.EventType == dto.EventAckRead {
			// 1. Store in database that read by me
			if err := h.markAsRead(msgReq.MessageID, senderID); err != nil {
				logger.Error("failed to mark message as read", slog.Any("error", err))
				continue
			}

			// 2. Broadcast to all clients
			if err := h.chatServer.BroadcastToRoom(dto.EventRead, msgReq.ChatID, senderID, &msgReq.MessageID, "read"); err != nil {
				logger.Error("failed to broadcast message", slog.Any("error", err))
			}

			continue
		}

		// Case IV : Bypass typing event
		// field: EventType, ChatID
		if msgReq.EventType == dto.EventTypingStart || msgReq.EventType == dto.EventTypingEnd {
			// 1. Broadcast to all clients
			if err := h.chatServer.BroadcastToRoom(msgReq.EventType, msgReq.ChatID, senderID, nil, msgReq.Content); err != nil {
				logger.Error("failed to broadcast message", slog.Any("error", err))
			}

			continue
		}

		// Case V : Reaction toggle
		if msgReq.EventType == dto.EventReaction {
			// 1. Toggle reaction in DB
			_, emojiAction, err := h.ToggleReaction(msgReq.MessageID, senderID, msgReq.Content)
			if err != nil {
				logger.Error("failed to toggle reaction", slog.Any("error", err))
				continue
			}

			// 2. Broadcast to all clients for real-time emoji update
			err = h.chatServer.BroadcastToRoom(dto.EventReaction, msgReq.ChatID, senderID, &msgReq.MessageID, msgReq.Content)
			if err != nil {
				logger.Error("failed to broadcast reaction message", slog.Any("error", err))
			}

			// 3. Find the owner of the message to notify (except sender)
			var message model.Message
			err = h.store.DB.First(&message, msgReq.MessageID).Error
			if err != nil {
				logger.Error("failed to get message owner", slog.Any("error", err))
				continue
			}

			err = h.chatServer.SendToUser(
				dto.EventReaction,
				msgReq.ChatID,
				senderID,
				message.SenderID,
				&msgReq.MessageID,
				msgReq.Content,
				emojiAction, // created or removed
			)
			if err != nil {
				logger.Error("failed to send reaction preview to message owner", slog.Any("error", err))
			}

			continue
		}

		// sender (receiver of message) has read
		// if msgReq.EventType == dto.EventRead {
		// 	err := h.store.DB.
		// 		Where("message_id = ? AND user_id = ?", msgReq.MessageID, senderID).
		// 		Delete(&model.Inbox{}).Error
		// 	if err != nil {
		// 		logger.Error("failed to delete inbox", slog.Any("error", err))
		// 		h.chatServer.BroadcastToRoom(errorMsg, msgReq.ChatID, senderID)
		// 	}
		// 	h.chatServer.BroadcastToRoom(msgReq, msgReq.ChatID, senderID)
		// 	continue
		// }

		// if msgReq.EventType == dto.EventStillActive {
		// 	h.chatServer.BroadcastToRoom(msgReq, msgReq.ChatID, senderID)
		// 	continue
		// }

		// for other events, just send to all clients
		// if msgType == websocket.TextMessage {
		// 	h.chatServer.BroadcastToRoom(msgReq.EventType, msgReq.ChatID, senderID, nil, msgReq.Content)
		// }
	}
}

func (h *Handler) sendRealtimeMessage(wg *sync.WaitGroup, c *websocket.Conn, receiverID uint, client *chat.Client) {
	defer wg.Done()

	for {
		select {
		case <-client.Terminate:
			return
		case msg := <-client.Message:
			if err := c.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
				logger.Error("failed sending message", slog.Any("error", err))
				logger.Info("closing connection...")
				h.chatServer.Logout(receiverID)
				return
			}
		}
	}
}
