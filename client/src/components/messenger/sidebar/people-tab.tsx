import { useGetAllUsers } from "@/hooks/use-get-all-users"

import { ChatCard } from "./card/chat-card"

export const PeopleTab = () => {
  const { users, loading } = useGetAllUsers()

  if (loading) {
    return <p>loading</p>
  }

  return (
    <div>
      <ChatCard
        name="Chanotai Krajeam"
        image="/thumbnail.jpg"
        lastMessage="hi"
        lastMessageFromMe={true}
        lastMessageDate={new Date()}
        isActive={true}
      />
    </div>
  )
}
