import { useEffect, useState } from "react"

import { getMyChats } from "@/actions/chat/get-my-chats"
import { Chat } from "@/types/chat"

export const useGetMyChats = (roomId: string) => {
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await getMyChats()
      if (!res) {
        return
      }

      setChats(res)
      setLoading(false)
    })()
  }, [roomId])

  return { chats, loading }
}
