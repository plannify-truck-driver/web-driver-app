import type { Workday } from "@/shared/models/workday"

export interface GetWorkdaysByPeriodRequest {
  from: string
  to: string
  page: number
  limit: number
}

export interface GetWorkdaysByPeriodResponse {
  data: Workday[]
  page: number
  total: number
}
