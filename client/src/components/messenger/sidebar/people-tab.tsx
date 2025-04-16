import { useState } from "react"

import { usePeopleQuery } from "@/hooks/use-people"

import { Skeleton } from "@/components/ui/skeleton"

import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { data: users, isLoading } = usePeopleQuery()
  const [currentPerson, setCurrentPerson] = useState<number | null>(null)

  if (isLoading || !users) {
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
