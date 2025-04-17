"use client"

import { useChatStore } from "@/stores/chat"
import { ChatInfo, User } from "@/types"
import Image from "next/image"

import { CommunitiesTab } from "./communities-tab"
import { CreateGroup } from "./create-group"
import { InboxTab } from "./inbox-tab"
import { PeopleTab } from "./people-tab"
import { TabButton } from "./tab-button"

export const Sidebar = ({
  chatList,
  allUsers,
}: {
  chatList: ChatInfo[]
  allUsers: User[]
}) => {
  const { tab, setTab } = useChatStore()

  const onlineUsers = useChatStore((state) => state.onlineUsers)

  return (
    <div className="bg-primary-background text-primary-foreground flex w-90 flex-initial flex-col space-y-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Chats</h1>
        <CreateGroup allUsers={allUsers} />
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {onlineUsers.map((user) => (
          <div key={user.id} className="flex w-20 flex-col items-center gap-2">
            <div className="relative size-16">
              <Image
                src={user.profilePictureUrl || "/thumbnail.jpg"}
                fill
                alt={user.name + " profile image"}
                className="rounded-full object-cover"
              />
              <div className="border-primary-background absolute right-0 bottom-0 z-10 size-5 rounded-full border-4 bg-green-500"></div>
            </div>
            <p className="line-clamp-1 text-center text-sm">
              {user.name.split(" ")[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-2">
        <TabButton onClick={() => setTab("inbox")} isActive={tab === "inbox"}>
          Inbox
        </TabButton>
        <TabButton onClick={() => setTab("people")} isActive={tab === "people"}>
          People
        </TabButton>
        <TabButton
          onClick={() => setTab("communities")}
          isActive={tab === "communities"}
        >
          Communities
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {tab === "inbox" && <InboxTab initialData={chatList} />}
        {tab === "people" && <PeopleTab />}
        {tab === "communities" && <CommunitiesTab />}
      </div>
    </div>
  )
}
