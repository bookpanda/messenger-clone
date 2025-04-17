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
  const { handleUpdateChatList, handleReactionPreviewChatList } = useChatList()
  const { wsLastMessage } = useSocket({ accessToken })

  useEffect(() => {
    if (!wsLastMessage) return
    const message: RealtimeMessage = JSON.parse(wsLastMessage.data)

    switch (message.event_type) {
      case "MESSAGE_UPDATE":
        handleUpdateChatList(message, true)
        break
      case "REACTION":
        handleReactionPreviewChatList(message, user.name, true)
        break
    }
  }, [wsLastMessage])

  return <div></div>
}
