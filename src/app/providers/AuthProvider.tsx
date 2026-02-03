import type { Driver } from "@/shared/models/driver"
import { useRouteContext } from "@tanstack/react-router"

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  driver: Driver | null
  accessToken: string | null
  login: () => void
  logout: () => void
  signinSilent: () => Promise<string | null>
  error: Error | null
}

export function useAuth() {
  const { auth } = useRouteContext({ from: "__root__" })
  return auth
}
