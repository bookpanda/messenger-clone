"use client"

import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react"

import { getChatMessages } from "@/actions/message/get-chat-messages"
import { useGetMyChats } from "@/hooks/use-get-my-chats"
import { Chat, ChatMessage, EventType, RealtimeMessage } from "@/types"
import { produce } from "immer"
import { useSession } from "next-auth/react"
import useWebSocket from "react-use-websocket"

import { ChatContext } from "./chat-context"

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat>({} as Chat)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const { chats: myChats } = useGetMyChats()

  const { data: session } = useSession()
  const socketUrl = useMemo(() => {
    if (!session?.accessToken || !currentChat?.id) return null
    return `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/v1/message/ws?accessToken=${session.accessToken}&chatID=${currentChat.id}`
  }, [session?.accessToken, currentChat?.id])

  const { sendMessage: wsSendMessage, lastMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("open"),
    onError: (event) => console.log("error", event),
    onClose: () => console.log("close"),
  })

  useEffect(() => {
    setChats(myChats)
    if (!myChats[0]) {
      return
    }

    const sortedChats = sortChats(myChats)
    setChats(sortedChats)
    setCurrentChat(sortedChats[0])
    ;(async () => {
      const res = await getChatMessages(sortedChats[0].id)
      if (res) setMessages(res)
    })()
  }, [myChats])

  useEffect(() => {
    if (!lastMessage) return
    const message: RealtimeMessage = JSON.parse(lastMessage.data)
    console.log("message", message)

    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        const newMessage: ChatMessage = {
          id: prevMessages.length + 1,
          chat_id: currentChat.id,
          sender_id: message.sender_id,
          content: message.content,
          created_at: new Date().toDateString(),
          reactions: [],
        }
        draft.push(newMessage)
      })
    )
  }, [lastMessage, currentChat.id])

  const addChat = (chat: Chat) => {
    setChats(
      produce((draft) => {
        draft.unshift(chat)
      })
    )
  }

  const sendMessage = (content: string, eventType: EventType) => {
    wsSendMessage(JSON.stringify({ event_type: eventType, content }))
  }

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        addChat,
        chats,
        setChats,
        messages,
        setMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const sortChats = (chats: Chat[]) => {
  return [...chats].sort((a, b) => {
    const dateA = new Date(a.last_message?.created_at ?? 0).getTime()
    const dateB = new Date(b.last_message?.created_at ?? 0).getTime()
    return dateB - dateA // latest message first
  })
}
