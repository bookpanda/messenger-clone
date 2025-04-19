import { client } from "@/api/client"
import { auth } from "@/auth"
import { chatResponseToChatInfo } from "@/lib/utils"
import { ChatInfo } from "@/types"
import { redirect } from "next/navigation"

export const getChatAction = async (id: number): Promise<ChatInfo> => {
  const session = await auth()
  const userId = session?.user?.userId

  const { response, data } = await client.GET("/api/v1/chat/{id}", {
    params: {
      path: {
        id,
      },
    },
  })
  if (response.status !== 200 || !data) {
    redirect("/messages")
  }

  return chatResponseToChatInfo(data.result, userId)
}
