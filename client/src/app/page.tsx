import { auth } from "@/auth"
import { Session } from "next-auth"
import { redirect } from "next/navigation"

import { Messenger } from "@/components/messenger"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return <Messenger />
}
