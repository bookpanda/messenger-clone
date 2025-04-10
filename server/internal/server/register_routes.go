package server

import "github.com/bookpanda/messenger-clone/internal/services/auth"

func (s *Server) RegisterRoutes(
	authHandler *auth.Handler,

) {
	v1 := s.app.Group("/api/v1")

	// auth
	auth := v1.Group("/auth")
	auth.Get("/google-login", authHandler.HandleGetGoogleLoginUrl)
	auth.Post("/login", authHandler.HandleLogin)
	auth.Post("/register", authHandler.HandleRegister)
	auth.Post("/refresh-token", authHandler.HandleRefreshToken)

}
