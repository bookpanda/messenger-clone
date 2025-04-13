import { Dispatch, SetStateAction, createContext, useContext } from "react"

import { Chat } from "@/types"

interface ChatContext {
  chats: Chat[]
  setChats: Dispatch<SetStateAction<Chat[]>>
  addChat: (chat: Chat) => void
  currentChat: Chat | undefined
  setCurrentChat: Dispatch<SetStateAction<Chat | undefined>>
}

export const ChatContext = createContext<ChatContext>({
  chats: [],
  setChats: () => {},
  addChat: () => {},
  currentChat: undefined,
  setCurrentChat: () => {},
})

export const useChatContext = () => {
  return useContext(ChatContext)
}
