import { api } from "@/shared/lib/api"
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
} from "./auth.types"

export const login = (body: LoginRequest): Promise<LoginResponse> => {
  return api.post("authentication/login", { json: body }).json()
}

export const registration = (body: RegistrationRequest): Promise<RegistrationResponse> => {
  return api.post("authentication/signup", { json: body }).json()
}
