import { api } from "@/shared/lib/api"
import type { GetMeResponse, UpdateMeRequest, UpdateMeResponse } from "./driver.types"

export const getMe = (): Promise<GetMeResponse> => {
  return api.get("me").json()
}

export const updateMe = (body: UpdateMeRequest): Promise<UpdateMeResponse> => {
  return api.patch("me", { json: body }).json()
}

export const deactivateMe = (): Promise<void> => {
  return api.post("me/deactivate").json()
}

export const reactivateMe = (): Promise<void> => {
  return api.post("me/reactivate").json()
}
