import { useCallback } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import { LastMessage, RealtimeMessage } from "@/types"
import { useSession } from "next-auth/react"

export const useChatList = () => {
  const {
    chatList,
    updateChatLastMessage,
    setChatList,
    clearChatUnread,
    setOnlineUsers,
  } = useChatStore()

  const { data } = useSession()

  const handleUpdateChatList = useCallback(
    async (message: RealtimeMessage, isUnread?: boolean) => {
      if (!chatList.find((chat) => chat.id === message.chat_id)) {
        const chatList = await getMyChatsAction()
        setChatList(chatList)
      } else {
        const lastMessage: LastMessage = {
          type:
            message.sender_id === data?.user?.userId ? "outgoing" : "incoming",
          message: message.content,
          date: new Date(),
        }
        updateChatLastMessage(message.chat_id, lastMessage, isUnread)
      }
    },
    [chatList, data?.user?.userId]
  )

  const handleReactionPreviewChatList = useCallback(
    async (message: RealtimeMessage, username: string, isUnread?: boolean) => {
      const chatExists = chatList.find((chat) => chat.id === message.chat_id)

      if (!chatExists) {
        const chatList = await getMyChatsAction()
        setChatList(chatList)
      } else {
        const isSenderMe = message.sender_id === data?.user?.userId
        if (message.emoji_action === "created") {
          const previewContent = `${username} reacted "${message.content}" to your message`

          const lastMessage: LastMessage = {
            type: isSenderMe ? "outgoing" : "incoming",
            message: previewContent,
            date: new Date(),
          }
          updateChatLastMessage(message.chat_id, lastMessage, isUnread)
        }
      }
    },
    [chatList, data?.user?.userId]
  )

  return {
    chatList,
    updateChatLastMessage,
    setChatList,
    clearChatUnread,
    handleUpdateChatList,
    setOnlineUsers,
    handleReactionPreviewChatList,
  }
}
