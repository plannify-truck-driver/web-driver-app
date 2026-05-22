import { api } from "@/shared/lib/api"
import type { UpdatesParams, UpdatesResponse } from "./updates.types"

export const getUpdates = ({ version = "", page = 0, limit = 0 }: UpdatesParams = {}): Promise<UpdatesResponse> => {
  return api
    .get("updates", { searchParams: { version, page, limit } })
    .json()
}
