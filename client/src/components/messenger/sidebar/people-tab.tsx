import { useGetAllUsers } from "@/hooks/use-get-all-users"
import { useSession } from "next-auth/react"

import { Skeleton } from "@/components/ui/skeleton"

import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { users, loading } = useGetAllUsers()
  const { data: session } = useSession()

  if (loading) {
    return (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="bg-muted-foreground/30 h-18 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {users.map((user) => {
        if (
          !user.id ||
          !user.name ||
          !user.profilePictureUrl ||
          user.email === session?.user?.email
        ) {
          return null
        }
        return (
          <PeopleCard
            key={user.id}
            isActive={false}
            name={user.name}
            image={user.profilePictureUrl}
          />
        )
      })}
    </div>
  )
}
