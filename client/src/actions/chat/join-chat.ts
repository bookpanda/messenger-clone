"use server"

import { client } from "@/api/client"

export const joinChatAction = async (chatId: number) => {
  const { response } = await client.POST("/api/v1/chat/{id}/join", {
    params: {
      path: {
        id: chatId,
      },
    },
  })

  if (!response.ok) {
    throw new Error("Failed to join chat")
  }

  return
}
