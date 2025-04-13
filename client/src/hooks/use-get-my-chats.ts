import { useEffect, useState } from "react"

import { getMyChats } from "@/actions/chat/get-my-chats"
import { Chat } from "@/types/chat"

export const useGetMyChats = () => {
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
  }, [])

  return { chats, loading }
}
