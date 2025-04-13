package server

import (
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/bookpanda/messenger-clone/internal/services/auth"
	"github.com/bookpanda/messenger-clone/internal/services/chat"
	"github.com/bookpanda/messenger-clone/internal/services/user"
)

func (s *Server) RegisterRoutes(
	authMiddleware authentication.AuthMiddleware,
	authHandler *auth.Handler,
	userHandler *user.Handler,
	chatHandler *chat.Handler,
) {
	v1 := s.app.Group("/api/v1")

	// auth
	auth := v1.Group("/auth")
	auth.Post("/login", authHandler.HandleLogin)
	auth.Post("/refresh-token", authHandler.HandleRefreshToken)
	auth.Post("/logout", authMiddleware.Auth, authHandler.HandleLogout)

	// chat
	chat := v1.Group("/chat")
	chat.Post("/", authMiddleware.Auth, chatHandler.HandleCreateChat)
	chat.Get("/", authMiddleware.Auth, chatHandler.HandleGetMyChats)
	chat.Patch("/:id/participants", authMiddleware.Auth, chatHandler.HandleModifyParticipants)

	// me
	me := v1.Group("/me")
	me.Get("/", authMiddleware.Auth, userHandler.HandleGetMe)
	me.Patch("/", authMiddleware.Auth, userHandler.HandleUpdateMe)

}
