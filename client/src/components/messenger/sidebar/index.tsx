import { useState } from "react"

import { InboxTab } from "./inbox-tab"
import { PeopleTab } from "./people-tab"
import { TabButton } from "./tab-button"

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<"inbox" | "people">("inbox")

  return (
    <div className="bg-primary-background text-primary-foreground w-90 flex-initial space-y-4 p-4">
      <h1 className="text-xl font-bold">Chats</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-2">
        <TabButton
          onClick={() => setActiveTab("inbox")}
          isActive={activeTab === "inbox"}
        >
          Inbox
        </TabButton>
        <TabButton
          onClick={() => setActiveTab("people")}
          isActive={activeTab === "people"}
        >
          Inbox
        </TabButton>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "inbox" && <InboxTab />}
        {activeTab === "people" && <PeopleTab />}
      </div>
    </div>
  )
}
