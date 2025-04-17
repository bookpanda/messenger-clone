"use server"

import { client } from "@/api/client"
import { auth } from "@/auth"
import { ChatMessage } from "@/types"

export async function getChatMessages(chatId: number) {
  const session = await auth()

  const userId = session?.user?.userId

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

  // Step 1: map to ChatMessage format & remove current user from read_by
  let res: ChatMessage[] = data.result.map((msg) => ({
    id: msg.id,
    chat_id: msg.chat_id,
    sender_id: msg.sender_id,
    content: msg.content,
    created_at: msg.created_at,
    reactions: msg.reactions || [],
    read_by: (msg.read_by || []).filter((id: number) => id !== userId),
  }))

  // Step 2: build a map of last read message index per user
  const lastReadIndexByUser: Record<number, number> = {}

  res.forEach((msg, index) => {
    for (const uid of msg.read_by) {
      lastReadIndexByUser[uid] = index
    }
  })

  // Step 3: clear all read_by, and assign each user only to the last message they read
  res = res.map((msg) => ({ ...msg, read_by: [] }))

  for (const [uidStr, index] of Object.entries(lastReadIndexByUser)) {
    const uid = parseInt(uidStr)
    res[index].read_by.push(uid)
  }

  return res
}
