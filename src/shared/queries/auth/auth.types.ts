export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
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
  access_token: string
}

export interface VerifyAccountRequest {
  driver_id: string
  token: string
}

export interface VerifyAccountResponse {
  access_token: string
}
