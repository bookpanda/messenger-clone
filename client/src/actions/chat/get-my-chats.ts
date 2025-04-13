import { client } from "@/api/client"

export async function getMyChats() {
  const { response, data } = await client.GET("/api/v1/chat")
  if (response.status !== 200 || !data) {
    return null
  }

  return data.result
}
