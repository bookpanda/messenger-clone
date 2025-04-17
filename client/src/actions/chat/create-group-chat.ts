"use server"

import { client } from "@/api/client"
import { auth } from "@/auth"

interface CreateGroupChatAction {
  name: string
  participantIds: string[]
}

export async function createChatGroupAction(payload: CreateGroupChatAction) {
  const session = await auth()

  const requesterId = session?.user?.userId.toString() || ""

  const allParticipantIds = new Set([...payload.participantIds, requesterId])

  const { response, data } = await client.POST("/api/v1/chat", {
    body: {
      name: payload.name,
      is_direct: false,
      participants: [...allParticipantIds],
    },
  })

  if (response.status !== 200 || !data) {
    throw new Error("Failed to create chat")
  }

  return data.result
}
