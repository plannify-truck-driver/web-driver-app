import { HTTPError } from "ky"
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
import type { Workday, WorkdayGarbage } from "@/shared/models/workday"

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

export const getWorkdayByDate = async (body: GetWorkdayByDateRequest): Promise<Workday | null> => {
  try {
    return await api.get(`workdays/${body.date}`).json<Workday>()
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) return null
    throw error
  }
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

export const getWorkdayGarbage = (): Promise<WorkdayGarbage[]> => {
  return api.get("workdays/garbage").json()
}

export const restoreWorkday = (body: RestoreWorkdayRequest): Promise<void> => {
  return api.delete(`workdays/garbage/${body.date}`).json()
}
