"use client"

import { signOut } from "@/auth"
import { Icon } from "@iconify/react"
import { useSession } from "next-auth/react"
import Image from "next/image"

export const ProfileMenu = () => {
  const { data: session } = useSession()

  const handleLogout = async () => {
    // const result = await logout()
    // if (result?.error) {
    //   console.error(result.error)
    //   return
    // }
    await signOut({
      redirect: true,
      redirectTo: "/",
    })
  }

  if (!session) {
    return
  }
  return (
    <div className="absolute right-0 z-100 mx-4 w-80 rounded-lg bg-[#232627] p-4 pt-8">
      <div className="mb-4 flex items-center gap-2">
        <Image
          alt="profile-pic"
          src={session?.user?.image}
          height={30}
          width={30}
          className="rounded-full"
        />
        <p className="font-medium">{session.user?.name}</p>
      </div>
      <hr className="mb-6 border-t border-gray-500" />
      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg text-sm hover:bg-white/10"
        onClick={handleLogout}
      >
        <Icon
          icon="majesticons:door-exit"
          className="m-1 size-9 rounded-full bg-white/10 p-1.5 text-gray-200"
        />
        Log Out
      </div>
    </div>
  )
}
