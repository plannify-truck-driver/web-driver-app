import { api } from "@/shared/lib/api"
import type { AppConfig } from "./config.types"

export const getConfig = (): Promise<AppConfig> => {
  return api.get("config").json()
}
