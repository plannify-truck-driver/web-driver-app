import type { Driver, JwtDriverPayload } from "@/shared/models/driver"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useDeleteRefreshTokenMutation, useRefreshToken } from "@/shared/queries/auth/auth.queries"
import { useQueryClient } from "@tanstack/react-query"

export interface AuthProviderState {
  driver: Driver | null
  accessToken: string | null
  login: (token: string) => void
  logout: () => void
  isDeletingRefreshToken: boolean
  refreshToken: () => Promise<boolean>
}

const initialState: AuthProviderState = {
  driver: null,
  accessToken: null,
  login: () => null,
  logout: () => null,
  isDeletingRefreshToken: false,
  refreshToken: async () => false,
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children, ...props }: { children: React.ReactNode }) {
  const { refetch } = useRefreshToken()
  const { mutateAsync, isPending: isDeletingRefreshToken } = useDeleteRefreshTokenMutation()
  const queryClient = useQueryClient()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)

  const login = useCallback((token: string) => {
    setAccessToken(token)
    const decoded: JwtDriverPayload = jwtDecode(token)
    setDriver(decoded.driver)
  }, [])

  function logout() {
    mutateAsync().then(() => {
      setAccessToken(null)
      setDriver(null)
      queryClient.clear()
    })
  }

  const refreshToken = useCallback(async () => {
    return refetch().then((res) => {
      if (res.data) {
        login(res.data.access_token)
        return true
      }
      return false
    })
  }, [refetch, login])

  useEffect(() => {
    if (!accessToken) return
    const decoded: JwtDriverPayload = jwtDecode(accessToken)
    const delay = decoded.exp * 1000 - Date.now() - 60_000

    if (delay <= 0) return
    const timerId = setTimeout(() => refreshToken(), delay)
    return () => clearTimeout(timerId)
  }, [accessToken, refreshToken])

  const value: AuthProviderState = {
    driver,
    accessToken,
    login,
    logout,
    isDeletingRefreshToken,
    refreshToken,
  }

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthProviderContext)

  return context
}
