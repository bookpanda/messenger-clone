import { useState } from "react"

import { usePeopleQuery } from "@/hooks/use-people"

import { Skeleton } from "@/components/ui/skeleton"

import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { data, isLoading } = usePeopleQuery()

  if (isLoading || !data) {
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
      {data.map((user, i) => {
        return <PeopleCard key={`${user.id}_${i}`} user={user} />
      })}
    </div>
  )
}
