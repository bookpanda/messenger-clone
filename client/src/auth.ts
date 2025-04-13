import NextAuth, { NextAuthConfig } from "next-auth"
import "next-auth/jwt"
import Google from "next-auth/providers/google"

import { client } from "./api/client"
import { User as UserType } from "./types/user"

export const authOptions: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!account || !account.id_token) return false
      // Login
      try {
        const { data, response } = await client.POST("/api/v1/auth/login", {
          body: {
            idToken: account.id_token,
            provider: account.provider.toUpperCase(),
          },
        })
        if (
          response.status !== 200 ||
          !data ||
          !data.result ||
          "error" in data
        ) {
          return false
        }
        user.accessToken = data.result.accessToken
        user.refreshToken = data.result.refreshToken
        user.expireAt = data.result.exp
        user.user = data.result.user
        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expireAt = user.expireAt
        token.user = user.user
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      if (token?.refreshToken) {
        session.refreshToken = token.refreshToken
      }
      if (token?.expireAt) {
        session.expireAt = token.expireAt
      }
      if (token?.user && session.user) {
        session.user.userId = token.user.id as number
      }
      return session
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)

declare module "next-auth" {
  interface Session {
    // used in session callback and after signIn
    accessToken?: string
    refreshToken?: string
    expireAt?: number
    user?: Omit<UserType, "id"> & { userId: number } & { image: string }
  }

  interface User {
    // used in signIn callback
    id?: string
    name?: string | null // automatically set by Google provider
    email?: string | null // automatically set by Google provider
    image?: string | null // automatically set by Google provider
    accessToken?: string
    refreshToken?: string
    expireAt?: number
    user?: UserType
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expireAt?: number
    user?: UserType
  }
}
