"use server"

import { client } from "@/api/client"

interface ChangeChatNamePayload {
  chatId: number
  name: string
}

export async function changeChatName(payload: ChangeChatNamePayload) {
  const { response } = await client.PATCH("/api/v1/chat/{id}/name", {
    params: {
      path: {
        id: payload.chatId,
      },
    },
    body: {
      name: payload.name,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to change chat name")
  }
}
