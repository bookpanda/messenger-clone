import { getChatMessages } from "@/actions/message/get-chat-messages"
import { useChatContext } from "@/contexts/chat-context"
import { Chat } from "@/types"
import { useSession } from "next-auth/react"
import Image from "next/image"

import { BaseCard } from "."

interface ChatCardProps {
  chat: Chat
  image: string
  isActive: boolean
}

export const ChatCard = (props: ChatCardProps) => {
  const { chat, image, isActive } = props
  const { name, is_direct } = chat
  const lastMessage = chat.last_message

  const { data: session } = useSession()
  const { setMessages, setCurrentChat } = useChatContext()

  const isLastMessageFromMe = lastMessage?.sender_id === session?.user?.userId
  const lastMessageDate = new Date(lastMessage?.created_at || "")

  let chatName = name
  let chatImage = image
  if (is_direct) {
    const participants = chat.participants.filter(
      (participant) => participant.id !== session?.user?.userId
    )
    chatName = participants[0]?.name || ""
    chatImage = participants[0]?.profilePictureUrl || ""
  }

  const handleMessages = async (chatID: number) => {
    const messages = await getChatMessages(chatID)

    if (!messages) {
      return
    }
    setMessages(messages)
    setCurrentChat(chat)
  }

  return (
    <BaseCard isActive={isActive} onClick={() => handleMessages(chat.id)}>
      <div className="relative size-14">
        <Image
          src={chatImage}
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <h2>{chatName}</h2>
        <div className="text-secondary-text flex items-center gap-1 text-xs">
          {lastMessage?.content && (
            <>
              <p>
                {isLastMessageFromMe
                  ? `You: ${lastMessage?.content}`
                  : lastMessage.content}
              </p>
              <p>&#8226;</p>
              <p>
                {lastMessageDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          )}
        </div>
      </div>
    </BaseCard>
  )
}
