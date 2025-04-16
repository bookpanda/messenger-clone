"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { signIn } from "next-auth/react"

import { Button } from "../ui/button"

export default function LoginPageComponent() {
  const handleLogin = async () => {
    await signIn("google", {
      redirect: true,
      redirectTo: "/",
    })
  }

  return (
    <div className="bg-primary-background flex min-h-screen flex-1 flex-col items-center justify-between py-32">
      <div className="flex flex-col items-center gap-6">
        <Icon icon="logos:messenger" className="size-16" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Welcome to Messenger</h1>
          <p className="text-sm font-medium text-gray-600">
            The simple way to text, call and video chat right from your desktop
          </p>
        </div>
      </div>
      <Button onClick={handleLogin} className="bg-messenger-primary min-w-64">
        Log in with Google
      </Button>
    </div>
  )
}
