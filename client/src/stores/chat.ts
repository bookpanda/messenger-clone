import { Chat, SidebarTab } from "@/types"
import { create } from "zustand"

interface ChatStore {
  tab: SidebarTab
  setTab: (sidebarTab: SidebarTab) => void
  currentChat: Chat | null
  setCurrentChat: (chat: Chat) => void
}

const useChatStore = create<ChatStore>()((set) => ({
  tab: "inbox",
  setTab: (sidebarTab) => set({ tab: sidebarTab }),
  currentChat: null,
  setCurrentChat: (chat) => set({ currentChat: chat }),
}))

export { useChatStore }
