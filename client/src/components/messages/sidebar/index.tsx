"use client"

import { useChatStore } from "@/stores/chat"
import { ChatInfo } from "@/types"

import { InboxTab } from "./inbox-tab"
import { PeopleTab } from "./people-tab"
import { TabButton } from "./tab-button"

export const Sidebar = ({ chatList }: { chatList: ChatInfo[] }) => {
  const { tab, setTab } = useChatStore()

  return (
    <div className="bg-primary-background text-primary-foreground w-90 flex-initial space-y-4 p-4">
      <h1 className="text-xl font-bold">Chats</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-2">
        <TabButton onClick={() => setTab("inbox")} isActive={tab === "inbox"}>
          Inbox
        </TabButton>
        <TabButton onClick={() => setTab("people")} isActive={tab === "people"}>
          People
        </TabButton>
      </div>

      {/* Tab Content */}
      <div>
        {tab === "inbox" && <InboxTab chatList={chatList} />}
        {tab === "people" && <PeopleTab />}
      </div>
    </div>
  )
}
