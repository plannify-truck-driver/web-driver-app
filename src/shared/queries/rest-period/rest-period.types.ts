import type { RestPeriod } from "@/shared/models/rest-period"

export type GetRestPeriodsResponse = RestPeriod[]

export interface CreateRestPeriodRequest {
  rest_periods: RestPeriod[]
}

export type CreateRestPeriodResponse = void
