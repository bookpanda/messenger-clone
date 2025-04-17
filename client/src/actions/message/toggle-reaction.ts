"use server"

import { client } from "@/api/client"

export async function toggleMessageReaction(messageId: number, emoji: string) {
  const { response, data } = await client.POST("/api/v1/message/{id}/react", {
    params: {
      path: {
        id: messageId,
      },
    },
    body: {
      emoji: emoji,
    },
  })

  if (response.status !== 200 || !data) {
    throw new Error("Failed to toggle reaction")
  }
  return data
}
