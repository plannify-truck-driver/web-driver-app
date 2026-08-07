import { useQuery } from "@tanstack/react-query"
import { getInformations } from "./informations.api"

export const informationsKeys = {
  all: ["informations"] as const,
}

export const useInformations = () =>
  useQuery({
    queryKey: informationsKeys.all,
    queryFn: getInformations,
  })
