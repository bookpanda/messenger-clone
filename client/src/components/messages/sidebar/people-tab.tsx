import { useEffect } from "react"

import { getPeopleAction } from "@/actions/user/get-people"
import { useChatStore } from "@/stores/chat"

import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { peopleList: data, setPeopleList } = useChatStore()

  const revalidate = async () => {
    const people = await getPeopleAction()
    setPeopleList(people)
  }

  useEffect(() => {
    revalidate()
  }, [])

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
