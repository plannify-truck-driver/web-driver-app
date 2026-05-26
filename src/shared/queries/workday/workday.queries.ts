import { useMutation, useQuery } from "@tanstack/react-query"
import {
  createWorkday,
  deleteWorkday,
  getWorkdayByDate,
  getWorkdayGarbage,
  getWorkdaysByMonth,
  getWorkdaysByPeriod,
  restoreWorkday,
  updateWorkday,
} from "./workday.api"
import type {
  CreateWorkdayRequest,
  DeleteWorkdayRequest,
  GetWorkdayByDateRequest,
  GetWorkdayByMonthRequest,
  GetWorkdaysByPeriodRequest,
  RestoreWorkdayRequest,
  UpdateWorkdayRequest,
} from "./workday.types"
import type { Workday } from "@/shared/models/workday"

export const workdaysKeys = {
  all: ["workdays"] as const,
  getWorkdaysByPeriod: (request: GetWorkdaysByPeriodRequest) =>
    [
      ...workdaysKeys.all,
      `workdays-${request.from}-${request.to}-${request.page}-${request.limit}`,
    ] as const,
  getWorkdaysByMonth: (request: GetWorkdayByMonthRequest) =>
    [...workdaysKeys.all, `workdays-month-${request.month}-${request.year}`] as const,
  getWorkdayByDate: (request: GetWorkdayByDateRequest) =>
    [...workdaysKeys.all, `workday-${request.date}`] as const,
}

export const useGetWorkdaysByPeriod = (request: GetWorkdaysByPeriodRequest) =>
  useQuery({
    queryKey: workdaysKeys.getWorkdaysByPeriod(request),
    queryFn: () => getWorkdaysByPeriod(request),
    enabled: true,
  })

export const useGetWorkdaysByMonth = (request: GetWorkdayByMonthRequest) =>
  useQuery({
    queryKey: workdaysKeys.getWorkdaysByMonth(request),
    queryFn: () => getWorkdaysByMonth(request),
  })

export const useGetWorkdayByDate = (request: GetWorkdayByDateRequest & { enabled?: boolean }) =>
  useQuery({
    queryKey: workdaysKeys.getWorkdayByDate(request),
    queryFn: () => getWorkdayByDate(request),
    enabled: request.enabled ?? true,
  })

export const useCreateWorkday = (options?: {
  onSuccess?: (data: Workday) => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: (body: CreateWorkdayRequest) => createWorkday(body),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })

export const useUpdateWorkday = (options?: {
  onSuccess?: (data: Workday) => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: (body: UpdateWorkdayRequest) => updateWorkday(body),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })

export const useDeleteWorkday = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: (body: DeleteWorkdayRequest) => deleteWorkday(body),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })

export const useGetWorkdayGarbage = () =>
  useQuery({
    queryKey: [...workdaysKeys.all, "garbage"] as const,
    queryFn: () => getWorkdayGarbage(),
  })

export const useRestoreWorkday = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: (body: RestoreWorkdayRequest) => restoreWorkday(body),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
