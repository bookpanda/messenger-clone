"use server"

import { client } from "@/api/client"

export async function getAllUsersAction() {
  const { response, data } = await client.GET("/api/v1/user")
  if (response.status !== 200 || !data) {
    return []
  }

  return data.result || []
}
