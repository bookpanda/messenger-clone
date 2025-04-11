"use client"

import { Icon } from "@iconify/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"

export const ProfilePicture = () => {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="relative cursor-pointer">
      <Image
        alt="profile-pic"
        src={session?.user?.image}
        height={40}
        width={40}
        className="rounded-full"
      />
      <div className="border-primary-background absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 bg-gray-600">
        <Icon
          icon="fluent:chevron-down-12-filled"
          className="size-full text-gray-200"
        />
      </div>
    </div>
  )
}
