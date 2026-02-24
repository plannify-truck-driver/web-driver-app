import { api } from "@/shared/lib/api"
import type {
  CreateWorkdayRequest,
  GetWorkdayByDateRequest,
  GetWorkdaysByPeriodRequest,
  GetWorkdaysByPeriodResponse,
} from "./workday.types"
import type { Workday } from "@/shared/models/workday"

export const getWorkdaysByPeriod = (
  body: GetWorkdaysByPeriodRequest
): Promise<GetWorkdaysByPeriodResponse> => {
  return api
    .get("workdays", {
      searchParams: { ...body },
    })
    .json()
}

export const getWorkdayByDate = (body: GetWorkdayByDateRequest): Promise<Workday | null> => {
  return api.get(`workdays/${body.date}`).json()
}

export const createWorkday = (body: CreateWorkdayRequest): Promise<Workday> => {
  return api.post("workdays", { json: body }).json()
}
