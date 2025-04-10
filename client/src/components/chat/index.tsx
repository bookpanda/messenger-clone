import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { IncomingMessage, OutgoingMessage, TimestampMessage } from "./messages"

const profile = {
  name: "Chanotai Krajeam",
  image: "/thumbnail.jpg",
  lastActive: new Date(Date.now() - 3 * 3600 * 1000),
}

export const Chat = () => {
  return (
    <div className="bg-primary-background text-primary-foreground flex h-full flex-1 flex-col overflow-hidden rounded-md">
      <ChatHeader
        name={profile.name}
        image={profile.image}
        lastActive={profile.lastActive}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Chat messages go here */}
          <IncomingMessage reaction="🥰" />
          <IncomingMessage />
          <IncomingMessage />
          <IncomingMessage />
          <TimestampMessage />
          <OutgoingMessage reaction="🥰" />
          <OutgoingMessage />
          <OutgoingMessage reaction="🥰" />
        </div>
      </div>

      <ChatInput />
    </div>
  )
}
