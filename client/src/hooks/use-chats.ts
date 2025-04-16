import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { useQuery } from "@tanstack/react-query"

export const useChatsQuery = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getMyChatsAction,
  })
}
