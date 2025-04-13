import { ChatCard } from "../chat-card"

export const InboxTab = () => {
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
      <ChatCard
        name="Chanotai Krajeam"
        image="/thumbnail.jpg"
        lastMessage="hi"
        lastMessageFromMe={false}
        lastMessageDate={new Date()}
        isActive={false}
      />
      <ChatCard
        name="Chanotai Krajeam"
        image="/thumbnail.jpg"
        lastMessage="hi"
        lastMessageFromMe={true}
        lastMessageDate={new Date()}
        isActive={false}
      />
    </div>
  )
}
