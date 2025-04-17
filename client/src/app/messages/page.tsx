import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { Messages } from "@/components/messages"

export default async function Page() {
  const session = await auth()

  if (!session || !session.accessToken || !session.user) {
    redirect("/")
  }

  return (
    <Messages
      accessToken={session.accessToken}
      user={{
        id: session.user.userId,
        name: session.user.name,
        email: session.user.email,
        profilePictureUrl: session.user.image,
      }}
    />
  )
}
