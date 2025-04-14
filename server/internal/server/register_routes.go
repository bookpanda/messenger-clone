package server

import (
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/bookpanda/messenger-clone/internal/services/auth"
	"github.com/bookpanda/messenger-clone/internal/services/chat"
	"github.com/bookpanda/messenger-clone/internal/services/message"
	"github.com/bookpanda/messenger-clone/internal/services/user"
	"github.com/gofiber/contrib/websocket"
)

func (s *Server) RegisterRoutes(
	authMiddleware authentication.AuthMiddleware,
	authHandler *auth.Handler,
	userHandler *user.Handler,
	chatHandler *chat.Handler,
	messageHandler *message.Handler,
) {
	v1 := s.app.Group("/api/v1")

	// auth
	auth := v1.Group("/auth")
	auth.Post("/login", authHandler.HandleLogin)
	auth.Post("/refresh-token", authHandler.HandleRefreshToken)
	auth.Post("/logout", authMiddleware.Auth, authHandler.HandleLogout)

	// me
	me := v1.Group("/me")
	me.Get("/", authMiddleware.Auth, userHandler.HandleGetMe)
	me.Patch("/", authMiddleware.Auth, userHandler.HandleUpdateMe)

	// user
	user := v1.Group("/user")
	user.Get("/", authMiddleware.Auth, userHandler.HandleGetAllUsers)

	// chat
	chat := v1.Group("/chat")
	chat.Post("/", authMiddleware.Auth, chatHandler.HandleCreateChat)
	chat.Get("/", authMiddleware.Auth, chatHandler.HandleGetMyChats)
	chat.Patch("/:id/participants", authMiddleware.Auth, chatHandler.HandleModifyParticipants)

	// message
	message := v1.Group("/message")
	message.Post("/", authMiddleware.Auth, messageHandler.HandleSendMessage)
	message.Get("/chat/:id", authMiddleware.Auth, messageHandler.HandleGetMessages)

	// HandleSupportWebAPI: put accessToken into Auth header
	// Auth: checks if the accessToken is valid
	// HandleWebsocket: upgrade the connection to websocket, set jwtEntity, chatID to context
	message.Use("/ws", messageHandler.HandleSupportWebAPI, authMiddleware.Auth, messageHandler.HandleWebsocket)
	message.Get("/ws", websocket.New(messageHandler.HandleRealTimeMessages))
}
