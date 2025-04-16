"use server"

import { client } from "@/api/client"

export async function getMyChatsAction() {
  const { response, data } = await client.GET("/api/v1/chat")
  if (response.status !== 200 || !data) {
    return null
  }

  return data.result
}
