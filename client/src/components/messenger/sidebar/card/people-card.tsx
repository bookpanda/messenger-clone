import { createChat } from "@/actions/chat/create-chat"
import { User } from "@/types"
import { useSession } from "next-auth/react"
import Image from "next/image"

import { BaseCard } from "."

interface PeopleCardProps {
  user: User
  isActive: boolean
}

export const PeopleCard = ({ user, isActive }: PeopleCardProps) => {
  const { data: session } = useSession()

  const handleGetChat = async () => {
    const chat = await createChat({
      name: `${session?.user?.name}-${user.name}`,
      isDirect: true,
      participants: [
        user.id?.toString() || "",
        session?.user?.userId.toString() || "",
      ],
    })

    if (!chat) {
      return
    }
  }

  return (
    <BaseCard isActive={isActive} onClick={handleGetChat}>
      <div className="relative size-14">
        <Image
          src={user.profilePictureUrl || ""}
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <h2>{user.name}</h2>
        <div className="text-secondary-text flex items-center gap-1 text-xs"></div>
      </div>
    </BaseCard>
  )
}
