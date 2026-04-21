import { api } from "@/shared/lib/api"
import type { CreateRestPeriodRequest, GetRestPeriodsResponse } from "./rest-period.types"

export const getRestPeriods = (): Promise<GetRestPeriodsResponse> => {
  return api.get("rest-periods").json()
}

export const createRestPeriod = (body: CreateRestPeriodRequest): Promise<null> => {
  return api.post("rest-periods", { json: body }).json()
}

export const deleteRestPeriod = (): Promise<void> => {
  return api.delete(`rest-periods`).json()
}
