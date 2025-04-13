import { useGetAllUsers } from "@/hooks/use-get-all-users"

import { ChatCard } from "./card/chat-card"
import { PeopleCard } from "./card/people-card"

export const PeopleTab = () => {
  const { users, loading } = useGetAllUsers()

  if (loading) {
    return <p>loading</p>
  }

  return (
    <div>
      {users.map((user) => {
        if (!user.id || !user.name || !user.profilePictureUrl) {
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
