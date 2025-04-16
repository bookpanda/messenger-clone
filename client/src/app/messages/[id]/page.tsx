import { Message } from "@/components/messages/message"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <Message id={id} />
}
