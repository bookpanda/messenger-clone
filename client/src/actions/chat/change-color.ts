"use server"

import { client } from "@/api/client"

interface ChangeChatColorPayload {
  chatId: number
  color: string
}

export async function changeChatColor(payload: ChangeChatColorPayload) {
  const { response } = await client.PATCH("/api/v1/chat/{id}/color", {
    params: {
      path: {
        id: payload.chatId,
      },
    },
    body: {
      color: payload.color,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to change chat color")
  }
}
