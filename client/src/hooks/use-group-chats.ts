import { getGroupChatsAction } from "@/actions/chat/get-group-chats"
import { CommunityInfo } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useGroupChatsQuery = ({
  initialData,
}: {
  initialData: CommunityInfo[]
}) => {
  return useQuery({
    queryKey: ["community-chats"],
    queryFn: getGroupChatsAction,
    initialData,
  })
}
