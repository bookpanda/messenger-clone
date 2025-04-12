package server

import (
	"github.com/bookpanda/messenger-clone/internal/middlewares/authentication"
	"github.com/bookpanda/messenger-clone/internal/services/auth"
	"github.com/bookpanda/messenger-clone/internal/services/chat"
)

func (s *Server) RegisterRoutes(
	authMiddleware authentication.AuthMiddleware,
	authHandler *auth.Handler,
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

}
