export interface GetMeResponse {
  allow_request_professional_agreement: boolean
  created_at: string
  deactivated_at: string | null
  email: string
  firstname: string
  gender: "M" | "F" | "O" | null
  is_searchable: boolean
  last_login_at: string | null
  lastname: string
  phone_number: string | null
  pk_driver_id: string
  verified_at: string | null
}

export interface UpdateMeRequest {
  email: string | null
  firstname: string | null
  gender: "M" | "F" | "O" | null
  language: string | null
  lastname: string | null
  password: string | null
  phone_number: string | null
}

export interface UpdateMeResponse {
  access_token: string
}
