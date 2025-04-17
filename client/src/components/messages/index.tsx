"use client"

import { useEffect } from "react"

import { RealtimeMessage, User } from "@/types"

import { useChatList } from "./hooks/use-chat-list"
import { useSocket } from "./hooks/use-socket"

export const Messages = ({
  accessToken,
  user,
}: {
  accessToken: string
  user: User
}) => {
  const { handleUpdateChatList, setOnlineUsers } = useChatList()
  const { wsLastMessage } = useSocket({ accessToken })

  // Duplicate
  useEffect(() => {
    if (!wsLastMessage) return
    const message: RealtimeMessage = JSON.parse(wsLastMessage.data)

    switch (message.event_type) {
      case "ONLINE_USERS":
        const onlineUsers: User[] = JSON.parse(message.content)
        setOnlineUsers(onlineUsers)
        break
      case "MESSAGE_UPDATE":
        handleUpdateChatList(message, true)
        break
    }
  }, [wsLastMessage])

  return <div></div>
}
