import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useChatStore } from "@/stores/chat"
import { LastMessage, RealtimeMessage, User } from "@/types"
import { useSession } from "next-auth/react"

export const useChatList = () => {
  const chatList = useChatStore((state) => state.chatList)
  const updateChatLastMessage = useChatStore(
    (state) => state.updateChatLastMessage
  )
  const setChatList = useChatStore((state) => state.setChatList)
  const clearChatUnread = useChatStore((state) => state.clearChatUnread)

  const { data } = useSession()

  const revalidateChatList = async () => {
    const chatList = await getMyChatsAction()
    setChatList(chatList)
  }

  const handleNewMessage = (message: RealtimeMessage, isUnread?: boolean) => {
    if (!chatList.find((chat) => chat.id === message.chat_id)) {
      // If not found in chatList, fetch the updated chat list
      revalidateChatList()
    } else {
      // If found, update the last message
      const lastMessage: LastMessage = {
        type:
          message.sender_id === data?.user?.userId ? "outgoing" : "incoming",
        message: message.content,
        date: new Date(),
      }
      updateChatLastMessage(message.chat_id, lastMessage, isUnread)
    }
  }

  return {
    chatList,
    updateChatLastMessage,
    setChatList,
    clearChatUnread,
    handleNewMessage,
    revalidateChatList,
  }
}
