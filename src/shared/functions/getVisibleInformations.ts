import type { Information } from "@/shared/queries/informations/informations.types"

export const getVisibleInformations = (informations: Information[], now: Date): Information[] =>
  informations.filter((information) => new Date(information.end_at) > now)
