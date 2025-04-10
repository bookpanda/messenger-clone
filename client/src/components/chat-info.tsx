import { Lock, Pin } from "lucide-react"
import Image from "next/image"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Button } from "./ui/button"

export const ChatInfo = () => {
  return (
    <div className="bg-primary-background text-primary-foreground w-75 space-y-5 rounded-md px-3 py-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative size-20">
          <Image
            src="/thumbnail.jpg"
            alt=""
            className="rounded-full object-cover"
            fill
          />
        </div>
        <h2 className="font-medium">Chanotai Krajeam</h2>
      </div>

      <div className="flex justify-center">
        <div className="bg-chat-composer-input-background-color text-primary-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
          <Lock className="size-3" />
          <span>End-to-end encrypted</span>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="cursor-pointer rounded-md p-2.5 hover:bg-white/10 hover:no-underline">
            Chat Info
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Button
              variant="ghost"
              className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
            >
              <Pin className="size-5" />
              <span>View pinned messages</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-none">
          <AccordionTrigger className="cursor-pointer rounded-md p-2.5 hover:bg-white/10 hover:no-underline">
            Customize chat
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Button
              variant="ghost"
              className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
            >
              <Pin className="size-5" />
              <span>Change themes</span>
            </Button>
            <Button
              variant="ghost"
              className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
            >
              <Pin className="size-5" />
              <span>Change emoji</span>
            </Button>
            <Button
              variant="ghost"
              className="hover:text-primary-foreground h-auto w-full justify-start rounded-md p-2.5 hover:bg-white/10 hover:no-underline"
            >
              <Pin className="size-5" />
              <span>Edit nicknames</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
