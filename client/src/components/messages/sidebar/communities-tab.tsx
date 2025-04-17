import { useEffect } from "react"

import { getGroupChatsAction } from "@/actions/chat/get-group-chats"
import { useChatStore } from "@/stores/chat"

import { CommunityCard } from "./card/community-card"

export const CommunitiesTab = () => {
  const { groupList: data, setGroupList } = useChatStore()

  const revalidate = async () => {
    const groups = await getGroupChatsAction()
    setGroupList(groups)
  }

  useEffect(() => {
    revalidate()
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center">
        No one here!
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
      {data.map((chat, idx) => {
        return (
          <CommunityCard
            key={`${chat.id}_${idx}`}
            id={chat.id}
            name={chat.name}
            image={chat.image}
            participants={chat.participants}
            isMember={chat.isMember}
          />
        )
      })}
    </div>
  )
}
