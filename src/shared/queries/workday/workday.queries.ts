import { useQuery } from "@tanstack/react-query"
import { getWorkdayByDate, getWorkdaysByPeriod } from "./workday.api"
import type { GetWorkdayByDateRequest, GetWorkdaysByPeriodRequest } from "./workday.types"

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
