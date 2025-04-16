import { useEffect, useState } from "react"

import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { Chat } from "@/types"

export const useGetMyChats = () => {
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await getMyChatsAction()
      if (!res) {
        return
      }

      setChats(res)
      setLoading(false)
    })()
  }, [])

  return { chats, loading }
}
