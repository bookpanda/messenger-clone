import { ChatInfo, CommunityInfo, LastMessage, SidebarTab, User } from "@/types"
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
  changeChatListName: (chatId: number, name: string) => void

  onlineUsers: User[]
  setOnlineUsers: (users: User[]) => void

  peopleList: User[]
  setPeopleList: (peopleList: User[]) => void

  groupList: CommunityInfo[]
  setGroupList: (groupList: CommunityInfo[]) => void
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
  changeChatListName: (chatId, name) =>
    set((state) => ({
      chatList: state.chatList.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              name,
            }
          : chat
      ),
    })),

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  peopleList: [],
  setPeopleList: (peopleList) => set({ peopleList }),

  groupList: [],
  setGroupList: (groupList) => set({ groupList }),
}))

export { useChatStore }
