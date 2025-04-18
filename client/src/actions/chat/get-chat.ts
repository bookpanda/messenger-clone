import { client } from "@/api/client"
import { auth } from "@/auth"
import { ChatInfo, LastMessage } from "@/types"
import { redirect } from "next/navigation"

export const getChatAction = async (id: number): Promise<ChatInfo> => {
  const session = await auth()
  const userId = session?.user?.userId

  const { response, data } = await client.GET("/api/v1/chat/{id}", {
    params: {
      path: {
        id,
      },
    },
  })
  if (response.status !== 200 || !data) {
    redirect("/messages")
  }

  const chat = data.result

  const lastMessage: LastMessage | null = chat.last_message
    ? {
        type: chat.last_message.sender_id === userId ? "outgoing" : "incoming",
        message: chat.last_message.content,
        date: new Date(chat.last_message.created_at),
      }
    : null

  if (chat.is_direct) {
    const friend = chat.participants.find(
      (participant) => participant.id !== userId
    )

    return {
      id: chat.id,
      name: friend?.name || "",
      image: friend?.profilePictureUrl || "/thumbnail.jpg",
      color: chat.color,
      emoji: chat.emoji,
      isGroup: !chat.is_direct,
      lastMessage,
      participants: chat.participants,
      unreadCount: chat.unread_count,
    }
  }

  return {
    id: chat.id,
    name: chat.name,
    image: "/thumbnail.jpg", // TODO: Group Image
    color: chat.color,
    emoji: chat.emoji,
    isGroup: !chat.is_direct,
    lastMessage,
    participants: chat.participants,
    unreadCount: chat.unread_count,
  }
}
