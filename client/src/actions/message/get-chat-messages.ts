"use server"

import { client } from "@/api/client"
import { ChatMessage } from "@/types"

export async function getChatMessages(chatId: number) {
  const { response, data } = await client.GET("/api/v1/message/chat/{id}", {
    params: {
      path: {
        id: chatId,
      },
    },
  })
  if (response.status !== 200 || !data) {
    throw new Error("Failed to fetch chat messages")
  }

  const res: ChatMessage[] = data.result
  return res
}
