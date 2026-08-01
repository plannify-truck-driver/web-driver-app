import { createRootRouteWithContext, useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import AppLayout from "@/layouts/AppLayout"
import AuthenticationLayout from "@/layouts/AuthenticationLayout"
import { useAuth } from "@/app/providers/useAuth"
import type { AuthProviderState } from "@/app/providers/AuthProviderContext"
import { SidebarProvider } from "@/shared/components/ui/Sidebar"
import { DriverPreferencesProvider } from "@/app/providers/DriverPreferencesProvider"
import { DevEnvironmentBanner } from "@/shared/components/DevEnvironmentBanner"

interface AppContext {
  auth: AuthProviderState
}

function RootComponent() {
  const { accessToken, driver } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isDevBannerVisible, setIsDevBannerVisible] = useState(true)

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

  const showDevBanner = import.meta.env.VITE_ENV === "development" && isDevBannerVisible

  let content = null
  if (!location.pathname.startsWith("/authentication")) {
    if (accessToken && driver && driver.verified) {
      content = (
        <DriverPreferencesProvider>
          <SidebarProvider>
            <AppLayout />
          </SidebarProvider>
        </DriverPreferencesProvider>
      )
    }
  } else {
    content = <AuthenticationLayout />
  }

  return (
    <div className="flex h-screen w-screen flex-col">
      {showDevBanner && <DevEnvironmentBanner onDismiss={() => setIsDevBannerVisible(false)} />}
      {content}
    </div>
  )
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})
