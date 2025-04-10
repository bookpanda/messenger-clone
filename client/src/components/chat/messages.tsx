import Image from "next/image"

interface MessageProps {}

export const IncomingMessage = (props: MessageProps) => {
  const {} = props

  return (
    <div className="flex items-end gap-2">
      <div className="relative size-7">
        <Image
          src="/thumbnail.jpg"
          alt=""
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="bg-chat-incoming-message-bubble-background-color rounded-full px-3 py-2">
        แต่กุศรัทธาใน work life unbalance
      </div>
    </div>
  )
}

export const OutgoingMessage = (props: MessageProps) => {
  const {} = props

  return (
    <div className="flex items-end justify-end gap-2">
      <div className="bg-chat-outgoing-message-bubble-background-color rounded-full px-3 py-2">
        แต่กุศรัทธาใน work life unbalance
      </div>
    </div>
  )
}

export const TimestampMessage = () => {
  return (
    <div className="text-placeholder-text px-5 py-4 text-center text-xs">
      7:25 AM
    </div>
  )
}
