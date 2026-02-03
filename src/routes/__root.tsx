import { createRootRouteWithContext } from "@tanstack/react-router"
import type { AuthState } from "@/app/providers/AuthProvider"
import { Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import AppLayout from "@/layouts/AppLayout"

interface AppContext {
  auth: AuthState
}

function RootComponent() {
  const { auth } = Route.useRouteContext()
  const hasTriedSignin = useRef(false)

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (auth.isAuthenticated) {
      hasTriedSignin.current = false
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading && !hasTriedSignin.current) {
      hasTriedSignin.current = true
      auth.login()
    }
  }, [auth])

  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <AppLayout />
}

export const Route = createRootRouteWithContext<AppContext>()({
  component: RootComponent,
})
