import { SidebarTab } from "@/types"
import { create } from "zustand"

interface ChatStore {
  tab: SidebarTab
  setTab: (sidebarTab: SidebarTab) => void
}

const useChatStore = create<ChatStore>()((set) => ({
  tab: "inbox",
  setTab: (sidebarTab) => set({ tab: sidebarTab }),
}))

export { useChatStore }
