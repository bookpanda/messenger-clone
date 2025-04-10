import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatCardProps {
  name: string;
  image: string;
  lastMessage: string;
  lastMessageFromMe: boolean;
  lastMessageDate: Date;
  isActive: boolean;
}

export const ChatCard = (props: ChatCardProps) => {
  const {
    name,
    image,
    lastMessage,
    lastMessageFromMe,
    lastMessageDate,
    isActive,
  } = props;

  return (
    <div
      className={cn(
        "flex gap-2 items-center p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors",
        {
          "bg-card-selected-background/20 hover:bg-card-selected-background/20":
            isActive,
        },
      )}
    >
      <div className="size-14 relative">
        <Image src={image} alt="" fill className="object-cover rounded-full" />
      </div>
      <div className="space-y-1">
        <h2>{name}</h2>
        <div className="text-xs text-secondary-text flex items-center gap-1">
          <p>{lastMessageFromMe ? `You: ${lastMessage}` : lastMessage}</p>
          <p>&#8226;</p>
          <p>
            {lastMessageDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
