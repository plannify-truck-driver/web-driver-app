import type { ErrorResponse } from "../common/common.types"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: {
    access_token: string
  }
  error: ErrorResponse
}

export interface SuspendedContent {
  message: string | null
  start_at: string
  end_at: string | null
}

export interface RegistrationRequest {
  firstname: string
  lastname: string
  gender: "M" | "F" | null
  email: string
  password: string
  language: "en" | "fr"
}

export interface RegistrationResponse {
  success: {
    access_token: string
  }
  error: ErrorResponse
}
