import { User } from "@/types"
import Image from "next/image"

interface ReadBubblesProps {
  users: User[]
}

export const ReadBubbles = ({ users }: ReadBubblesProps) => {
  if (!users || users.length === 0) return null

  return (
    <div className="mt-1.5 flex justify-end gap-x-0.5">
      {users.map((user) => (
        <Image
          key={user.id}
          alt="pfp-pic"
          src={user.profilePictureUrl || ""}
          className="size-4 rounded-full"
          width={20}
          height={20}
        />
      ))}
    </div>
  )
}
