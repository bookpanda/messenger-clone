import { useState } from "react"

import { useGetAllUsers } from "@/hooks/use-get-all-users"
import { useSession } from "next-auth/react"

import { Skeleton } from "@/components/ui/skeleton"

import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { users, loading } = useGetAllUsers()
  const { data: session } = useSession()
  const [currentPerson, setCurrentPerson] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="bg-muted-foreground/30 h-18 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user, i) => {
        return (
          <div key={`${user.id}_${i}`} onClick={() => setCurrentPerson(i)}>
            <PeopleCard isActive={currentPerson === i} user={user} />
          </div>
        )
      })}
    </div>
  )
}
