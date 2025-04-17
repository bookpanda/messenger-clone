import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { ChatInfo } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useChatsQuery = ({ initialData }: { initialData: ChatInfo[] }) => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: getMyChatsAction,
    initialData,
  })
}
