import { api } from "@/shared/lib/api"
import type { GetInformationsResponse } from "./informations.types"

export const getInformations = (): Promise<GetInformationsResponse> => {
  return api.get("informations").json()
}
