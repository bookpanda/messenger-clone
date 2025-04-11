"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"

export const ProfilePicture = () => {
  // getSessio
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  console.log(session)
  return (
    <div>
      hid
      {session?.user?.image}
      {/* <Image /> */}
    </div>
  )
}
