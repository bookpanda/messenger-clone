package message

import (
	"github.com/cockroachdb/errors"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

const jwtEntityKey = "jwtEntityKey"
const chatIDKey = "chatIDKey"

// @Summary      connect to websocket
// @Description  Establish a WebSocket connection for real-time communication.
// @Description  The message from a server will be in a format of "[EVENT] [MESSAGE]" which [EVENT] can be "ERROR" or "MESSAGE".
// @Description  If [EVENT] is error, [MESSAGE] will be a string of error message ,otherwise it will be a dto.RealTimeMessageResponse
// @Tags         message
// @Router       /api/v1/message/ws [GET]
// @Security	 ApiKeyAuth
// @Success      101    "Switching Protocols"
// @Failure      400
func (h *Handler) HandleWebsocket(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		jwtEntity, err := h.authMiddleware.GetJWTEntityFromContext(c.UserContext())
		if err != nil {
			return errors.Wrap(err, "failed getting jwtEntity from context")
		}
		c.Locals(jwtEntityKey, jwtEntity)

		// chatID, err := strconv.ParseUint(c.Query("chatID"), 10, 0)
		// if err != nil {
		// 	return apperror.BadRequest("invalid chat id", err)
		// }
		// c.Locals(chatIDKey, chatID)

		return c.Next()
	}
	return fiber.ErrUpgradeRequired
}
