import { Chat, ChatWithProfile, Profile, SidebarTab } from "@/types"
import { create } from "zustand"

interface ChatStore {
  tab: SidebarTab
  setTab: (sidebarTab: SidebarTab) => void

  currentChat: ChatWithProfile | null
  setCurrentChat: (chat: Chat, profile: Profile) => void
}

const useChatStore = create<ChatStore>()((set) => ({
  tab: "inbox",
  setTab: (sidebarTab) => set({ tab: sidebarTab }),

  currentChat: null,
  setCurrentChat: (chat, profile) =>
    set({
      currentChat: {
        chat,
        profile: {
          name: profile.name,
          image: profile.image,
          lastActive: new Date(Date.now() - 3 * 3600 * 1000),
        },
      },
    }),
}))

export { useChatStore }
