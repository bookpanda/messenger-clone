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

  const revalidateChatList = async () => {
    const chatList = await getMyChatsAction()
    setChatList(chatList)
  }

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

  return {
    chatList,
    updateChatLastMessage,
    setChatList,
    clearChatUnread,
    handleUpdateChatList,
    revalidateChatList,
    setOnlineUsers,
  }
}
