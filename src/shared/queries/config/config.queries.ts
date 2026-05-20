import { useQuery } from "@tanstack/react-query"
import { getConfig } from "./config.api"

export const configKeys = {
  all: ["config"] as const,
}

export const useConfig = () =>
  useQuery({
    queryKey: configKeys.all,
    queryFn: getConfig,
    staleTime: Infinity,
  })
