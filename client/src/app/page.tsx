import { auth } from "@/auth"
import { redirect } from "next/navigation"

import LoginPageComponent from "@/components/login"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/messages")
  }

  return <LoginPageComponent />
}
