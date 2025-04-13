import { Dispatch, SetStateAction, createContext, useContext } from "react"

import { Chat, ChatMessage } from "@/types"

interface ChatContext {
  chats: Chat[]
  setChats: Dispatch<SetStateAction<Chat[]>>
  addChat: (chat: Chat) => void
  currentChat: Chat
  setCurrentChat: Dispatch<SetStateAction<Chat>>
  messages: ChatMessage[]
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
}

export const ChatContext = createContext<ChatContext>({
  chats: [],
  setChats: () => {},
  addChat: () => {},
  currentChat: {} as Chat,
  setCurrentChat: () => {},
  messages: [],
  setMessages: () => {},
})

export const useChatContext = () => {
  return useContext(ChatContext)
}
