import { useQuery } from "@tanstack/react-query"
import { getUpdates } from "./updates.api"
import type { UpdatesParams } from "./updates.types"

export const updatesKeys = {
  all: ["updates"] as const,
  list: (params: UpdatesParams) => [...updatesKeys.all, params] as const,
}

export const useUpdates = (params: UpdatesParams = {}) =>
  useQuery({
    queryKey: updatesKeys.list(params),
    queryFn: () => getUpdates(params),
  })
