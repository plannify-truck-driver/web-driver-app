import type { JwtDriverPayload } from "@/shared/models/driver"
import { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useDeleteRefreshTokenMutation, useRefreshToken } from "@/shared/queries/auth/auth.queries"
import { handleErrorResponse } from "@/shared/lib/error-response"
import { setApiAccessToken } from "@/shared/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import { setRefreshTokenHandler } from "@/lib/queryClient"
import { AuthProviderContext } from "./AuthProviderContext"
import type { AuthProviderState } from "./AuthProviderContext"

const HAS_SESSION_STORAGE_KEY = "auth-had-session"

export function AuthProvider({ children, ...props }: { children: React.ReactNode }) {
  const { refetch } = useRefreshToken()
  const { mutateAsync, isPending: isDeletingRefreshToken } = useDeleteRefreshTokenMutation()
  const queryClient = useQueryClient()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [driver, setDriver] = useState<AuthProviderState["driver"]>(null)
  const [hadSession, setHadSession] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HAS_SESSION_STORAGE_KEY) === "true"
    } catch {
      // ignore localStorage errors (private browsing, quota exceeded, etc.)
      return false
    }
  })

  const login = useCallback((token: string) => {
    setAccessToken(token)
    setApiAccessToken(token)
    const decoded: JwtDriverPayload = jwtDecode(token)
    setDriver(decoded.driver)
    setHadSession(true)
    try {
      localStorage.setItem(HAS_SESSION_STORAGE_KEY, "true")
    } catch {
      // ignore localStorage errors (private browsing, quota exceeded, etc.)
    }
  }, [])

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setApiAccessToken(null)
    setDriver(null)
    setHadSession(false)
    try {
      localStorage.removeItem(HAS_SESSION_STORAGE_KEY)
    } catch {
      // ignore localStorage errors (private browsing, quota exceeded, etc.)
    }
    queryClient.clear()
  }, [queryClient])

  function logout() {
    mutateAsync().then(() => {
      clearSession()
    })
  }

  const refreshToken = useCallback(async () => {
    return refetch().then(async (res) => {
      if (res.data) {
        login(res.data.access_token)
        return true
      }
      if (res.error) {
        const apiError = await handleErrorResponse(res.error)
        if (apiError?.error_code === "INVALID_REFRESH_TOKEN") {
          clearSession()
        }
      }
      return false
    })
  }, [refetch, login, clearSession])

  useEffect(() => {
    setRefreshTokenHandler(refreshToken)
  }, [refreshToken])

  useEffect(() => {
    if (!accessToken) return
    const decoded: JwtDriverPayload = jwtDecode(accessToken)

    // Refresh the token 1 minute before it expires
    const delay = decoded.exp * 1000 - Date.now() - 60_000

    if (delay <= 0) {
      refreshToken()
      return
    }

    const timerId = setTimeout(() => refreshToken(), delay)
    return () => clearTimeout(timerId)
  }, [accessToken, refreshToken])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" || !accessToken) return
      const decoded: JwtDriverPayload = jwtDecode(accessToken)
      const delay = decoded.exp * 1000 - Date.now() - 60_000
      if (delay <= 0) refreshToken()
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [accessToken, refreshToken])

  const value: AuthProviderState = {
    driver,
    accessToken,
    hadSession,
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
