import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/app/providers/useAuth"
import i18n from "@/i18n"
import {
  createWorkday,
  deleteWorkday,
  getWorkdayByDate,
  getWorkdayCreationLimit,
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

/**
 * Thrown by workday mutations when the driver's account is suspended. A
 * suspended account may keep browsing the app but cannot create, update,
 * delete or restore a workday. Feature `onError` handlers can early-return
 * on this error since the guard already shows a toast.
 */
export class WorkdayActionForbiddenError extends Error {
  constructor() {
    super("Workday actions are forbidden while the account is suspended")
    this.name = "WorkdayActionForbiddenError"
  }
}

/**
 * Returns a guard to call at the start of a workday mutation. When the
 * account is suspended it notifies the user and throws
 * `WorkdayActionForbiddenError`, preventing the API call.
 */
const useAssertWorkdayActionAllowed = () => {
  const { driver } = useAuth()
  return () => {
    if (driver?.suspension) {
      toast.error(i18n.t("pages.workdays.errors.account-suspended"))
      throw new WorkdayActionForbiddenError()
    }
  }
}

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
  getCreationLimit: () => [...workdaysKeys.all, "creation-limit"] as const,
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
}) => {
  const assertWorkdayActionAllowed = useAssertWorkdayActionAllowed()
  return useMutation({
    mutationFn: (body: CreateWorkdayRequest) => {
      assertWorkdayActionAllowed()
      return createWorkday(body)
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

export const useUpdateWorkday = (options?: {
  onSuccess?: (data: Workday) => void
  onError?: (error: Error) => void
}) => {
  const assertWorkdayActionAllowed = useAssertWorkdayActionAllowed()
  return useMutation({
    mutationFn: (body: UpdateWorkdayRequest) => {
      assertWorkdayActionAllowed()
      return updateWorkday(body)
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

export const useDeleteWorkday = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) => {
  const assertWorkdayActionAllowed = useAssertWorkdayActionAllowed()
  return useMutation({
    mutationFn: (body: DeleteWorkdayRequest) => {
      assertWorkdayActionAllowed()
      return deleteWorkday(body)
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

export const useGetWorkdayCreationLimit = () =>
  useQuery({
    queryKey: workdaysKeys.getCreationLimit(),
    queryFn: () => getWorkdayCreationLimit(),
  })

export const useGetWorkdayGarbage = () =>
  useQuery({
    queryKey: [...workdaysKeys.all, "garbage"] as const,
    queryFn: () => getWorkdayGarbage(),
  })

export const useRestoreWorkday = (options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) => {
  const assertWorkdayActionAllowed = useAssertWorkdayActionAllowed()
  return useMutation({
    mutationFn: (body: RestoreWorkdayRequest) => {
      assertWorkdayActionAllowed()
      return restoreWorkday(body)
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
