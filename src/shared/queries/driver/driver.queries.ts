import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deactivateMe, getMe, reactivateMe, updateMe } from "./driver.api"

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

export const useDeactivateMeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.me() })
    },
  })
}

export const useReactivateMeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reactivateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.me() })
    },
  })
}
