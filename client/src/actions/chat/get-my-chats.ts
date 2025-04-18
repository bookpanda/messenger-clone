"use server"

import { client } from "@/api/client"
import { auth } from "@/auth"
import { chatResponseToChatInfo } from "@/lib/utils"
import { ChatInfo } from "@/types"

export async function getMyChatsAction() {
  const session = await auth()
  const userId = session?.user?.userId

  const { response, data } = await client.GET("/api/v1/chat")
  if (response.status !== 200 || !data) {
    return []
  }

  const chats: ChatInfo[] = data.result.map((chat) => {
    return chatResponseToChatInfo(chat, userId)
  })

  return chats
}
