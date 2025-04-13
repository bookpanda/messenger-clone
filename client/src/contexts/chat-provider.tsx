"use client"

import { FC, PropsWithChildren, useEffect, useState } from "react"

import { getChatMessages } from "@/actions/message/get-chat-messages"
import { useGetMyChats } from "@/hooks/use-get-my-chats"
import { Chat, ChatMessage } from "@/types"
import { produce } from "immer"

import { ChatContext } from "./chat-context"

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat>({} as Chat)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const { chats: myChats } = useGetMyChats()

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
    setChats((prevChats) => sortChats(prevChats))
  }, [chats])

  const addChat = (chat: Chat) => {
    setChats(
      produce((draft) => {
        draft.unshift(chat)
      })
    )
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
