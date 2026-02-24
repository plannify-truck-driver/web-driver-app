import { useMutation, useQuery } from "@tanstack/react-query"
import {
  createWorkday,
  deleteWorkday,
  getWorkdayByDate,
  getWorkdaysByPeriod,
  restoreWorkday,
  updateWorkday,
} from "./workday.api"
import type {
  CreateWorkdayRequest,
  DeleteWorkdayRequest,
  GetWorkdayByDateRequest,
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
  getWorkdayByDate: (request: GetWorkdayByDateRequest) =>
    [...workdaysKeys.all, `workday-${request.date}`] as const,
}

export const useGetWorkdaysByPeriod = (request: GetWorkdaysByPeriodRequest) =>
  useQuery({
    queryKey: workdaysKeys.getWorkdaysByPeriod(request),
    queryFn: () => getWorkdaysByPeriod(request),
    enabled: true,
  })

export const useGetWorkdayByDate = (request: GetWorkdayByDateRequest) =>
  useQuery({
    queryKey: workdaysKeys.getWorkdayByDate(request),
    queryFn: () => getWorkdayByDate(request),
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

export const useRestoreWorkday = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) =>
  useMutation({
    mutationFn: (body: RestoreWorkdayRequest) => restoreWorkday(body),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
