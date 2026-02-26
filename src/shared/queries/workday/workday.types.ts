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

export interface GetWorkdayByDateRequest {
  date: string
}

export interface GetWorkdayByMonthRequest {
  month: string
  year: string
}

export interface CreateWorkdayRequest {
  date: string
  start_time: string
  end_time: string | null
  rest_time: string
  overnight_rest: boolean
}

export type UpdateWorkdayRequest = CreateWorkdayRequest

export interface DeleteWorkdayRequest {
  date: string
}

export interface RestoreWorkdayRequest {
  date: string
}
