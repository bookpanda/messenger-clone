"use client"

import { FC, PropsWithChildren, useEffect, useState } from "react"

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
    setCurrentChat(myChats[0])
  }, [myChats])

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
