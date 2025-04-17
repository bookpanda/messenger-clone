import { ReactNode } from "react"

import { getGroupChatsAction } from "@/actions/chat/get-group-chats"
import { getMyChatsAction } from "@/actions/chat/get-my-chats"
import { getAllUsersAction } from "@/actions/user/get-users"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/messages/sidebar"

export default async function Layout({ children }: { children: ReactNode }) {
  const chatList = await getMyChatsAction()
  const groupChats = await getGroupChatsAction()
  const allUsers = await getAllUsersAction()

  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          chatList={chatList}
          groupChats={groupChats}
          allUsers={allUsers}
        />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
