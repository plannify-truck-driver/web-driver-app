import type { Driver } from "@/shared/models/driver"
import { createContext } from "react"

export interface AuthProviderState {
  driver: Driver | null
  accessToken: string | null
  hadSession: boolean
  login: (token: string) => void
  logout: () => void
  isDeletingRefreshToken: boolean
  refreshToken: () => Promise<boolean>
}

const initialState: AuthProviderState = {
  driver: null,
  accessToken: null,
  hadSession: false,
  login: () => null,
  logout: () => null,
  isDeletingRefreshToken: false,
  refreshToken: async () => false,
}

export const AuthProviderContext = createContext<AuthProviderState>(initialState)
