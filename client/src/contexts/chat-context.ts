"use client"

import { Dispatch, SetStateAction, createContext, useContext } from "react"

import { Chat, ChatMessage, EventType } from "@/types"

interface ChatContext {
  chats: Chat[]
  setChats: Dispatch<SetStateAction<Chat[]>>
  addChat: (chat: Chat) => void
  currentChat: Chat
  setCurrentChat: Dispatch<SetStateAction<Chat>>
  messages: ChatMessage[]
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
  sendMessage: (content: string, eventType: EventType) => void
  typingUserIDs: number[]
}

export const ChatContext = createContext<ChatContext>({
  chats: [],
  setChats: () => {},
  addChat: () => {},
  currentChat: {} as Chat,
  setCurrentChat: () => {},
  messages: [],
  setMessages: () => {},
  sendMessage: () => {},
  typingUserIDs: [],
})

export const useChatContext = () => {
  return useContext(ChatContext)
}
