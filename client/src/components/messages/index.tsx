"use client"

import { useEffect } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import { LastMessage, RealtimeMessage, User } from "@/types"
import useWebSocket from "react-use-websocket"

export const Messages = ({
  accessToken,
  user,
}: {
  accessToken: string
  user: User
}) => {
  const { chatList, updateChatLastMessage, clearChatUnread, setChatList } =
    useChatStore()

  const socketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/message/ws?accessToken=${accessToken}`
  const { sendMessage: wsSendMessage, lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("open"),
    onError: (event) => console.log("error", event),
    onClose: () => console.log("close"),
  })

  // Duplicate
  const handleNewMessage = async (message: RealtimeMessage) => {
    if (!chatList.find((chat) => chat.id === message.chat_id)) {
      const chatList = await getMyChatsAction()
      setChatList(chatList)
    } else {
      const lastMessage: LastMessage = {
        type: message.sender_id === user.id ? "outgoing" : "incoming",
        message: message.content,
        date: new Date(),
      }
      updateChatLastMessage(message.chat_id, lastMessage)
    }
  }

  useEffect(() => {
    if (!lastMessage) return
    const message: RealtimeMessage = JSON.parse(lastMessage.data)

    switch (message.event_type) {
      case "MESSAGE_UPDATE":
        handleNewMessage(message)
        break
    }
  }, [lastMessage])

  return <div></div>
}
