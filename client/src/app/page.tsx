import { auth } from "@/auth"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { redirect } from "next/navigation"

import { Messenger } from "@/components/messenger"

export default async function Home() {
  const session: Session | null | undefined = await auth()

  console.log("session", session)

  if (!session) {
    redirect("/login")
  }

  return (
    <SessionProvider session={session}>
      <Messenger />
    </SessionProvider>
  )
}
