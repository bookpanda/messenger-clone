"use server"

import { client } from "@/api/client"
import { auth } from "@/auth"

interface CreateChatAction {
  friendId: number
}

export async function createChatAction(payload: CreateChatAction) {
  const session = await auth()

  const requesterId = session?.user?.userId.toString() || ""
  const friendId = payload.friendId.toString()

  const { response, data } = await client.POST("/api/v1/chat", {
    body: {
      name: `${requesterId}-${friendId}`,
      is_direct: true,
      participants: [requesterId, friendId],
    },
  })

  if (response.status !== 200 || !data) {
    throw new Error("Failed to create chat")
  }

  return data.result
}
