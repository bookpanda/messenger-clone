"use server"

import { client } from "@/api/client"

interface ChangeChatEmojiPayload {
  chatId: number
  emoji: string
}

export async function changeChatEmoji(payload: ChangeChatEmojiPayload) {
  const { response } = await client.PATCH("/api/v1/chat/{id}/emoji", {
    params: {
      path: {
        id: payload.chatId,
      },
    },
    body: {
      emoji: payload.emoji,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to change chat emoji")
  }
}
