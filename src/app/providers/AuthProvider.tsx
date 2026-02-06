import type { Driver, JwtDriverPayload } from "@/shared/models/driver"
import { createContext, useContext, useState } from "react"
import { jwtDecode } from "jwt-decode"

export interface AuthProviderState {
  driver: Driver | null
  accessToken: string | null
  login: (token: string) => void
  logout: () => void
}

const initialState: AuthProviderState = {
  driver: null,
  accessToken: null,
  login: () => null,
  logout: () => null,
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children, ...props }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)

  function login(token: string) {
    setAccessToken(token)
    const decoded: JwtDriverPayload = jwtDecode(token)
    setDriver(decoded.driver)
  }

  function logout() {
    setAccessToken(null)
    setDriver(null)
  }

  const value: AuthProviderState = {
    driver,
    accessToken,
    login,
    logout,
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
