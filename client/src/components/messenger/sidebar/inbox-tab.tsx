import { useChatContext } from "@/contexts/chat-context"

import { ChatCard } from "./card/chat-card"

export const InboxTab = () => {
  const { chats, currentChat } = useChatContext()

  return (
    <div>
      {chats.map((chat) => (
        <ChatCard
          key={chat.id}
          chat={chat}
          image="/thumbnail.jpg"
          isActive={chat.id === currentChat?.id}
        />
      ))}
    </div>
  )
}
