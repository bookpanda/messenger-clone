import { Icon } from "@iconify/react";
import AjDaeng from "@/assets/thumbnail.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-secondary-background flex h-dvh flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-primary-background text-primary-foreground flex-initial border-b border-white/20 px-4">
        <div className="py-2">
          <div className="size-10">
            <Icon icon="logos:facebook" className="size-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="bg-primary-background text-primary-foreground w-90 flex-initial p-4 space-y-4">
          <h1 className="font-bold text-xl">Chats</h1>
          <div className="flex gap-2 items-center bg-card-selected-background/20 p-2 rounded-md">
            <div className="size-14 relative">
              <Image
                src={AjDaeng}
                alt=""
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="space-y-1">
              <h2>Chanotai Krajeam</h2>
              <div className="text-xs text-secondary-text flex items-center gap-1">
                <p>You: Fuck off</p>
                <p>&#8226;</p>
                <p>26m</p>
              </div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1"></div>
      </div>
    </div>
  );
}
