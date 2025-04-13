"use server"

import { client } from "@/api/client"

export async function getChatMessages(chatID: number) {
  const { response, data } = await client.GET("/api/v1/message/chat/{id}", {
    params: {
      path: {
        id: chatID,
      },
    },
  })
  if (response.status !== 200 || !data) {
    return null
  }

  return data.result
}
