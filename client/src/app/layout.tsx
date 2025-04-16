import TanstackProvider from "@/providers/tanstack-provider"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import Providers from "../providers/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Messenger",
  description: "Made by WinJaroonPatJamjam team",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <Providers>{children}</Providers>
        </TanstackProvider>
      </body>
    </html>
  )
}
