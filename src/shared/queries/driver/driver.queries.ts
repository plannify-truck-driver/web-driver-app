import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMe, updateMe } from "./driver.api"

export const driverKeys = {
  all: ["driver"] as const,
  me: () => [...driverKeys.all, "me"] as const,
}

export const useGetMe = () =>
  useQuery({
    queryKey: driverKeys.me(),
    queryFn: getMe,
  })

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.me() })
    },
  })
}
