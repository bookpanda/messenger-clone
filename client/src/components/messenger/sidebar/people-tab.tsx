import { ChatCard } from "../chat-card"

export const PeopleTab = () => {
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
