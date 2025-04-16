import { useState } from "react"

import { useChatStore } from "@/stores/chat"

import { Chat } from "../chat"
import { ChatInfo } from "../chat-info"

export const Message = ({ id }: { id: string }) => {
  const [openChatInfo, setOpenChatInfo] = useState(true)
  const { currentChat } = useChatStore()

  return (
    <div className="flex min-h-0 flex-1 gap-4 p-4">
      {currentChat && (
        <>
          <Chat
            profile={{
              name: currentChat.profile.name,
              image: currentChat.profile.image,
              lastActive: currentChat.profile.lastActive,
            }}
            setOpenChatInfo={setOpenChatInfo}
          />
          {openChatInfo && <ChatInfo />}
        </>
      )}
    </div>
  )
}
