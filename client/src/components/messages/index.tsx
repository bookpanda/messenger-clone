"use client"

import { useEffect } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import { LastMessage, RealtimeMessage, User } from "@/types"

import { useSocket } from "./hooks/use-socket"

export const Messages = ({
  accessToken,
  user,
}: {
  accessToken: string
  user: User
}) => {
  const { chatList, updateChatLastMessage, setChatList } = useChatStore()
  const { wsLastMessage } = useSocket({ accessToken })

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
      updateChatLastMessage(message.chat_id, lastMessage, true)
    }
  }

  useEffect(() => {
    if (!wsLastMessage) return
    const message: RealtimeMessage = JSON.parse(wsLastMessage.data)

    switch (message.event_type) {
      case "MESSAGE_UPDATE":
        handleNewMessage(message)
        break
    }
  }, [wsLastMessage])

  return <div></div>
}
