import { usePeopleQuery } from "@/hooks/use-people"

import { Skeleton } from "@/components/ui/skeleton"

import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { data, isLoading } = usePeopleQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="bg-muted-foreground/30 h-18 w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center">
        No one here!
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
      {data.map((user, i) => {
        return <PeopleCard key={`${user.id}_${i}`} friend={user} />
      })}
    </div>
  )
}
