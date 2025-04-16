"use server"

import { client } from "@/api/client"

export async function getPeopleAction() {
  const { response, data } = await client.GET("/api/v1/user/people")
  if (response.status !== 200 || !data) {
    return null
  }

  return data.result || []
}
