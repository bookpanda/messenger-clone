import { getPeopleAction } from "@/actions/user/get-people"
import { User } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const usePeopleQuery = ({ initialData }: { initialData: User[] }) => {
  return useQuery({
    queryKey: ["people"],
    queryFn: getPeopleAction,
    initialData,
  })
}
