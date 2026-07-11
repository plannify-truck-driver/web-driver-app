import { createRootRouteWithContext, useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import AppLayout from "@/layouts/AppLayout"
import AuthenticationLayout from "@/layouts/AuthenticationLayout"
import { useAuth } from "@/app/providers/useAuth"
import type { AuthProviderState } from "@/app/providers/AuthProviderContext"
import { SidebarProvider } from "@/shared/components/ui/Sidebar"
import { DriverPreferencesProvider } from "@/app/providers/DriverPreferencesProvider"

interface AppContext {
  auth: AuthProviderState
}

function RootComponent() {
  const { accessToken, driver } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.pathname.startsWith("/authentication") && (!accessToken || !driver)) {
      navigate({ to: "/authentication/login", search: { redirect: location.pathname } })
      return
    }

    if (location.pathname.startsWith("/authentication/verify-account") && !accessToken) {
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
    return (
      <DriverPreferencesProvider>
        <SidebarProvider>
          <AppLayout />
        </SidebarProvider>
      </DriverPreferencesProvider>
    )
  }
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})
