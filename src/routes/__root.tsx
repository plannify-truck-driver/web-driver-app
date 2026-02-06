import { createRootRouteWithContext, useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import AppLayout from "@/layouts/AppLayout"
import AuthenticationLayout from "@/layouts/AuthenticationLayout"
import { useAuth, type AuthProviderState } from "@/app/providers/AuthProvider"

interface AppContext {
  auth: AuthProviderState
}

function RootComponent() {
  const { accessToken, driver } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.pathname.startsWith("/authentication") && (!accessToken || !driver)) {
      navigate({ to: "/authentication/login" })
      return
    }

    if (
      driver &&
      !driver.verified &&
      !location.pathname.startsWith("/authentication/verify-account")
    ) {
      navigate({ to: "/authentication/verify-account" })
    }
  }, [accessToken, driver, location.pathname, navigate])

  if (!location.pathname.startsWith("/authentication")) {
    if (!accessToken || !driver) {
      return null
    }
    if (!driver.verified) {
      return null
    }
  }

  if (location.pathname.startsWith("/authentication")) {
    return <AuthenticationLayout />
  } else {
    return <AppLayout />
  }
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})
