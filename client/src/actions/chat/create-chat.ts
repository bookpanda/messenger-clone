"use server"

import { client } from "@/api/client"

interface CreateChatAction {
  name: string
  isDirect: boolean
  participants: string[]
}

export async function createChat(payload: CreateChatAction) {
  const { response, data } = await client.POST("/api/v1/chat", {
    body: {
      name: payload.name,
      is_direct: payload.isDirect,
      participants: payload.participants,
    },
  })
  if (response.status !== 200 || !data) {
    return null
  }

  return data.result
}
