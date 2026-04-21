import { useMutation, useQuery } from "@tanstack/react-query"
import { createRestPeriod, deleteRestPeriod, getRestPeriods } from "./rest-period.api"
import type { CreateRestPeriodRequest } from "./rest-period.types"

export const restPeriodsKeys = {
  all: ["rest-periods"] as const,
}

export const useGetRestPeriods = () =>
  useQuery({
    queryKey: restPeriodsKeys.all,
    queryFn: () => getRestPeriods(),
    enabled: true,
  })

export const useCreateRestPeriod = (options?: {
  onSuccess?: (data: null) => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: (body: CreateRestPeriodRequest) => createRestPeriod(body),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })

export const useDeleteRestPeriod = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: () => deleteRestPeriod(),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
