import { api } from "@/shared/lib/api"
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from "./auth.types"

export const login = (body: LoginRequest): Promise<LoginResponse> => {
  return api.post("authentication/login", { json: body }).json()
}

export const registration = (body: RegistrationRequest): Promise<RegistrationResponse> => {
  return api.post("authentication/signup", { json: body }).json()
}

export const verifyAccount = (body: VerifyAccountRequest): Promise<VerifyAccountResponse> => {
  return api.post("authentication/token/verify-account", { json: body }).json()
}
