import { getPeopleAction } from "@/actions/user/get-people"
import { useQuery } from "@tanstack/react-query"

export const usePeopleQuery = () => {
  return useQuery({
    queryKey: ["people"],
    queryFn: getPeopleAction,
  })
}
