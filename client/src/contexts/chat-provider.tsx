"use client"

import { FC, PropsWithChildren, useEffect, useState } from "react"

import { useGetMyChats } from "@/hooks/use-get-my-chats"
import { Chat } from "@/types"
import { produce } from "immer"

import { ChatContext } from "./chat-context"

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const { chats: myChats } = useGetMyChats()

  useEffect(() => {
    setChats(myChats)
  }, [myChats])

  const addChat = (chat: Chat) => {
    setChats(
      // @ts-expect-error immer
      produce((draft) => {
        draft.unshift(chat)
      })
    )
  }

  const [currentChat, setCurrentChat] = useState<Chat | undefined>(undefined)

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        setCurrentChat,
        addChat,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
