import { api } from "@/shared/lib/api"
import type {
  CreateWorkdayRequest,
  DeleteWorkdayRequest,
  GetWorkdayByDateRequest,
  GetWorkdayByMonthRequest,
  GetWorkdaysByPeriodRequest,
  GetWorkdaysByPeriodResponse,
  RestoreWorkdayRequest,
  UpdateWorkdayRequest,
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

export const getWorkdaysByMonth = (body: GetWorkdayByMonthRequest): Promise<Workday[]> => {
  return api
    .get("workdays/month", {
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

export const updateWorkday = (body: UpdateWorkdayRequest): Promise<Workday> => {
  return api.put(`workdays`, { json: body }).json()
}

export const deleteWorkday = (body: DeleteWorkdayRequest): Promise<void> => {
  return api.delete(`workdays/${body.date}`).json()
}

export const restoreWorkday = (body: RestoreWorkdayRequest): Promise<void> => {
  return api.delete(`workdays/garbage/${body.date}`).json()
}
