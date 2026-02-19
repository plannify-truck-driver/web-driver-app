import { useQuery } from "@tanstack/react-query"
import { getWorkdaysByPeriod } from "./workday.api"
import type { GetWorkdaysByPeriodRequest } from "./workday.types"

export const workdaysKeys = {
  all: ["workdays"] as const,
  getWorkdaysByPeriod: (request: GetWorkdaysByPeriodRequest) =>
    [
      ...workdaysKeys.all,
      `workdays-${request.from}-${request.to}-${request.page}-${request.limit}`,
    ] as const,
}

export const useGetWorkdaysByPeriod = (request: GetWorkdaysByPeriodRequest) =>
  useQuery({
    queryKey: workdaysKeys.getWorkdaysByPeriod(request),
    queryFn: () => getWorkdaysByPeriod(request),
    enabled: true,
  })
