import { getMyChats } from "@/actions/chat/get-my-chats"

import { ChatCard } from "../chat-card"

export const PeopleTab = async () => {
  const chats = await getMyChats()
  if (!chats || chats.length === 0) {
    return <div className="text-center text-gray-500">No chats found</div>
  }

  return (
    <div>
      <ChatCard
        name="Chanotai Krajeam"
        image="/thumbnail.jpg"
        lastMessage="hi"
        lastMessageFromMe={true}
        lastMessageDate={new Date()}
        isActive={true}
      />
    </div>
  )
}
