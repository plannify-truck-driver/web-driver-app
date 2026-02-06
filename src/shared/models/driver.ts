export interface Driver {
  id: string
  first_name: string
  last_name: string
  email: string
  verified: boolean
}

//needed because of the actual backend to be removed when the backend handles the jwt correctly
export interface JwtDriverPayload {
  sub: string
  driver: Driver
  iat: number
  exp: number
}
