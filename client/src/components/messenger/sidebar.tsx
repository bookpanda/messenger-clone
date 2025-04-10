import { ChatCard } from "./chat-card";

export const Sidebar = () => {
  return (
    <div className="bg-primary-background text-primary-foreground w-90 flex-initial p-4 space-y-4">
      <h1 className="font-bold text-xl">Chats</h1>
      <div>
        <ChatCard
          name="Chanotai Krajeam"
          image="/thumbnail.jpg"
          lastMessage="Fuck off"
          lastMessageFromMe={true}
          lastMessageDate={new Date()}
          isActive={true}
        />
        <ChatCard
          name="Chanotai Krajeam"
          image="/thumbnail.jpg"
          lastMessage="Fuck off"
          lastMessageFromMe={false}
          lastMessageDate={new Date()}
          isActive={false}
        />
        <ChatCard
          name="Chanotai Krajeam"
          image="/thumbnail.jpg"
          lastMessage="Fuck off"
          lastMessageFromMe={true}
          lastMessageDate={new Date()}
          isActive={false}
        />
      </div>
    </div>
  );
};
