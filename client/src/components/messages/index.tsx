"use client"

import { useEffect } from "react"

import { RealtimeMessage, User } from "@/types"
import { useSession } from "next-auth/react"

import { useChatList } from "./hooks/use-chat-list"
import { useSocket } from "./hooks/use-socket"

export const Messages = ({ accessToken }: { accessToken: string }) => {
  const {
    handleUpdateChatList,
    setOnlineUsers,
    handleReactionPreviewChatList,
  } = useChatList()
  const { wsLastMessage } = useSocket({ accessToken })
  const { data: session } = useSession()
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
      case "REACTION":
        if (message.emoji_action) {
          if (session && session.user && session.user.name) {
            handleReactionPreviewChatList(message, session.user.name, true)
          }
        }
        break
    }
  }, [wsLastMessage])

  return <div></div>
}
