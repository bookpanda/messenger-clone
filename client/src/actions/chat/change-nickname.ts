"use server"

import { client } from "@/api/client"

interface Request {
  chatId: number
  participantId: number
  nickname: string
}

export async function changeNickname(payload: Request) {
  const { response } = await client.PATCH(
    "/api/v1/chat/{id}/participant/{participantId}/nickname",
    {
      params: {
        path: {
          id: payload.chatId,
          participantId: payload.participantId,
        },
      },
      body: {
        nickname: payload.nickname,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to change nickname")
  }

  return
}
