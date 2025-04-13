import { useState } from "react"

import { ChatCard } from "../chat-card"
import { InboxTab } from "./inbox-tab"
import { PeopleTab } from "./people-tab"

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<"inbox" | "people">("inbox")

  return (
    <div className="bg-primary-background text-primary-foreground w-90 flex-initial space-y-4 p-4">
      <h1 className="text-xl font-bold">Chats</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            activeTab === "inbox"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab("people")}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            activeTab === "people"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          People
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "inbox" && <InboxTab />}
        {activeTab === "people" && <PeopleTab />}
      </div>
    </div>
  )
}
