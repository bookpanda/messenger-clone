import { ReactNode } from "react"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/messages/sidebar"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-secondary-background flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
