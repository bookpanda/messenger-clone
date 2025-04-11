"use client"

import { signIn } from "next-auth/react"

import { Button } from "../ui/button"

// import SignInContent from "../register/sign-in-content"

export default function LoginPageComponent() {
  const handleLogin = async () => {
    await signIn("google", {
      redirect: true,
      redirectTo: "/",
    })
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {/* <SignInContent /> */}
      <Button onClick={handleLogin}>Login with Google</Button>
    </div>
  )
}
