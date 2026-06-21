import { api } from "@/shared/lib/api"
import type {
  ConfirmResetPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegistrationRequest,
  RegistrationResponse,
  ResetPasswordRequest,
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

export const refreshToken = (): Promise<RefreshTokenResponse> => {
  return api.get("authentication/refresh").json()
}
export const deleteRefreshToken = (): Promise<void> => {
  return api.delete("authentication/refresh").json()
}

export const resetPassword = (body: ResetPasswordRequest): Promise<void> => {
  return api.post("authentication/reset-password", { json: body }).json()
}

export const confirmResetPassword = (body: ConfirmResetPasswordRequest): Promise<void> => {
  return api.post("authentication/confirm-reset-password", { json: body }).json()
}
