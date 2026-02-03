export interface Driver {
  id: string
  firstname: string
  lastname: string
  email: string
  verified: boolean
}

//needed because of the actual backend to be removed when the backend handles the jwt correctly
export interface JwtDriverPayload {
  sub: string
  email: string
  username: string
  profilePicture?: string
  totpAuthentication: boolean
  verifiedAt: Date | null
  createdAt?: string
  updatedAt?: string
}
