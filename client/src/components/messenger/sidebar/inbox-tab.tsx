import { useChatContext } from "@/contexts/chat-context"

import { ChatCard } from "./card/chat-card"

export const InboxTab = () => {
  const { chats, currentChat } = useChatContext()

  return (
    <div className="flex flex-col gap-2">
      {chats.map((chat, idx) => (
        <ChatCard
          key={chat.id + "_" + idx}
          chat={chat}
          image="/thumbnail.jpg"
          isActive={chat.id === currentChat?.id}
        />
      ))}
    </div>
  )
}
