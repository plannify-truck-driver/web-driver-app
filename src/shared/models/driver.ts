export interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  verified: boolean
}

export interface JwtDriverPayload {
  sub: string
  driver: Driver
  iat: number
  exp: number
}
