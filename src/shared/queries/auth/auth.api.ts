import { api } from "@/shared/lib/api"
import type { LoginRequest } from "./auth.types"

export const login = (body: LoginRequest) => {
  return api.post("authentication/login", { json: body }).json()
}
