import { api } from "@/shared/lib/api"
import type { GetWorkdaysByPeriodRequest, GetWorkdaysByPeriodResponse } from "./workday.types"

export const getWorkdaysByPeriod = (
  body: GetWorkdaysByPeriodRequest
): Promise<GetWorkdaysByPeriodResponse> => {
  return api
    .get("workdays", {
      searchParams: { ...body },
    })
    .json()
}
