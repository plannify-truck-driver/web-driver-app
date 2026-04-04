import { authKeys, useRefreshToken } from "@/shared/queries/auth/auth.queries"
import { QueryClient, type Query } from "@tanstack/react-query"
import { useEffect } from "react"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
    },
  },
})

export const setRefreshTokenHandler = (refreshFn: () => Promise<unknown>) => {
  queryClient.setDefaultOptions({
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
    },
    mutations: {},
  })

  // Global error handler
  queryClient.getQueryCache().config.onError = async (error: Error, query: Query<unknown, unknown, unknown, readonly unknown[]>) => {
    if (query.queryKey.join(".") === authKeys.refreshToken().join(".")) return
    await handleUnauthorized(error, refreshFn)
  }

  queryClient.getMutationCache().config.onError = async (error: unknown) => {
    await handleUnauthorized(error, refreshFn)
  }
}

const handleUnauthorized = async (error: unknown, refreshFn: () => Promise<unknown>) => {
  if (!(error && typeof error === "object" && "response" in error)) return
  const body = await (error as { response: Response }).response.clone().json()
  if (body?.error_code === "UNAUTHORIZED") {
    await refreshFn()
  }
}

export const QueryClientConfigurator = ({ children }: { children: React.ReactNode }) => {
  const { refetch } = useRefreshToken()

  useEffect(() => {
    setRefreshTokenHandler(refetch)
  }, [refetch])

  return children
}
