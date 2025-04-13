import { Dispatch, SetStateAction, createContext, useContext } from "react"

import { Chat } from "@/types/chat"

interface ChatContext {
  chats: Chat[]
  setChats: Dispatch<SetStateAction<Chat[]>>
  currentChat: Chat | undefined
  setCurrentChat: Dispatch<SetStateAction<Chat | undefined>>
}

export const ChatContext = createContext<ChatContext>({
  chats: [],
  setChats: () => {},
  currentChat: undefined,
  setCurrentChat: () => {},
})

export const useChatContext = () => {
  return useContext(ChatContext)
}
