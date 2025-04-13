import Image from "next/image"

import { BaseCard } from "."

interface PeopleCardProps {
  name: string
  image: string
  isActive: boolean
}

export const PeopleCard = (props: PeopleCardProps) => {
  const { name, image, isActive } = props

  const handleGetChat = () => {}

  return (
    <BaseCard isActive={isActive} onClick={handleGetChat}>
      <div className="relative size-14">
        <Image src={image} alt="" fill className="rounded-full object-cover" />
      </div>
      <div className="space-y-1">
        <h2>{name}</h2>
        <div className="text-secondary-text flex items-center gap-1 text-xs"></div>
      </div>
    </BaseCard>
  )
}
