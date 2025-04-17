"use server"

import { client } from "@/api/client"
import { auth } from "@/auth"
import { CommunityInfo, LastMessage } from "@/types"

export async function getGroupChatsAction(): Promise<CommunityInfo[]> {
  const session = await auth()
  const userId = session?.user?.userId

  const { response, data } = await client.GET("/api/v1/chat/group")
  if (response.status !== 200 || !data) {
    return []
  }

  const chats: CommunityInfo[] = data.result.map((chat) => {
    const lastMessage: LastMessage | null = chat.last_message
      ? {
          type:
            chat.last_message.sender_id === userId ? "outgoing" : "incoming",
          message: chat.last_message.content,
          date: new Date(chat.last_message.created_at),
        }
      : null

    return {
      id: chat.id,
      name: chat.name,
      image: "/thumbnail.jpg", // TODO: Replace with actual group image when available
      lastMessage,
      participants: chat.participants,
      unreadCount: chat.unread_count || 0,
      isMember: !!chat.participants.find(
        (participant) => participant.id === userId
      ),
    }
  })

  return chats
}
