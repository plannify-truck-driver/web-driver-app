export interface DriverSuspension {
  message: string
  start_at: string
  end_at: string | null
}

export interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  verified: boolean
  deactivation_planned_at: string | null
  suspension: DriverSuspension | null
}

export interface JwtDriverPayload {
  sub: string
  driver: Driver
  iat: number
  exp: number
}
