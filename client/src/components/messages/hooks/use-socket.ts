import { RealtimeMessage } from "@/types"
import useWebSocket from "react-use-websocket"

export const useSocket = ({ accessToken }: { accessToken: string }) => {
  const socketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/message/ws?accessToken=${accessToken}`
  const { sendMessage: wsSendMessage, lastMessage: wsLastMessage } =
    useWebSocket(socketUrl, {
      onOpen: () => console.log("open"),
      onError: (event) => console.log("error", event),
      onClose: () => console.log("close"),
    })

  const handleOpenConnection = (chatId: number) => {
    const payload: RealtimeMessage = {
      event_type: "CONNECT",
      content: "<connect>",
      chat_id: chatId,
      sender_id: 0, // don't care
    }
    wsSendMessage(JSON.stringify(payload))
  }

  const handleTyping = (chatId: number, type: "START" | "END") => {
    const payload: RealtimeMessage = {
      event_type: type === "START" ? "TYPING_START" : "TYPING_END",
      content: "<placeholder>",
      chat_id: chatId,
      sender_id: 0, // don't care
    }
    wsSendMessage(JSON.stringify(payload))
  }

  const handleSendMessage = (chatId: number, message: string) => {
    const payload: RealtimeMessage = {
      event_type: "MESSAGE",
      content: message,
      chat_id: chatId,
      sender_id: 0, // don't care
    }
    wsSendMessage(JSON.stringify(payload))
  }

  const handleAckRead = (chatId: number, messageId: number) => {
    const payload: RealtimeMessage = {
      event_type: "ACK_READ",
      content: "<read>",
      chat_id: chatId,
      message_id: messageId,
      sender_id: 0, // don't care
    }
    wsSendMessage(JSON.stringify(payload))
  }

  const handleSendReaction = (
    chatId: number,
    messageId: number,
    emoji: string,
    senderId: number
  ) => {
    const payload: RealtimeMessage = {
      event_type: "REACTION",
      content: emoji,
      chat_id: chatId,
      message_id: messageId,
      sender_id: senderId,
    }
    wsSendMessage(JSON.stringify(payload))
  }

  return {
    wsLastMessage,
    handleOpenConnection,
    handleTyping,
    handleSendMessage,
    handleAckRead,
    handleSendReaction,
  }
}
