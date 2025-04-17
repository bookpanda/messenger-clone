import { ChatInfo, LastMessage, SidebarTab } from "@/types"
import { create } from "zustand"

interface ChatStore {
  tab: SidebarTab
  setTab: (sidebarTab: SidebarTab) => void

  chatList: ChatInfo[]
  setChatList: (chatList: ChatInfo[]) => void
  updateChatLastMessage: (
    chatId: number,
    lastMessage: LastMessage,
    isUnread?: boolean
  ) => void
  clearChatUnread: (chatId: number) => void
}

const useChatStore = create<ChatStore>((set) => ({
  tab: "inbox",
  setTab: (sidebarTab) => set({ tab: sidebarTab }),

  chatList: [],
  setChatList: (chatList) => set({ chatList }),
  updateChatLastMessage: (chatId, lastMessage, isUnread) =>
    set((state) => ({
      chatList: state.chatList.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage,
              unreadCount: isUnread ? chat.unreadCount + 1 : chat.unreadCount,
            }
          : chat
      ),
    })),
  clearChatUnread: (chatId) =>
    set((state) => ({
      chatList: state.chatList.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              unreadCount: 0,
            }
          : chat
      ),
    })),
}))

export { useChatStore }
