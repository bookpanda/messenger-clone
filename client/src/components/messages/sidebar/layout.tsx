import { ReactNode } from "react"

import { getAllUsersAction } from "@/actions/user/get-users"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/messages/sidebar"

export default async function Layout({ children }: { children: ReactNode }) {
  const allUsers = await getAllUsersAction()

  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <Sidebar allUsers={allUsers} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
