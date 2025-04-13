import { useEffect, useState } from "react"

import { getAllUsers } from "@/actions/user/get-all-users"
import { User } from "@/types/user"

export const useGetAllUsers = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await getAllUsers()
      if (!res) {
        return
      }

      setUsers(res)
      setLoading(false)
    })()
  }, [])

  return { users, loading }
}
