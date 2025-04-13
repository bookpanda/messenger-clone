"use server"

import { client } from "@/api/client"

export async function getChatMessages(chatID: number, content: string) {
  const { response, data } = await client.POST("/api/v1/message", {
    body: {
      chat_id: chatID,
      content,
    },
  })
  if (response.status !== 200 || !data) {
    return null
  }

  return data.result
}
