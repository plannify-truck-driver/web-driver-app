import { handleErrorResponse } from "@/shared/lib/error-response"
import { useRefreshToken } from "@/shared/queries/auth/auth.queries"
import { QueryClient } from "@tanstack/react-query"
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
  queryClient.getQueryCache().config.onError = async (error: unknown) => {
    await handleUnauthorized(error, refreshFn)
  }

  queryClient.getMutationCache().config.onError = async (error: unknown) => {
    await handleUnauthorized(error, refreshFn)
  }
}

const handleUnauthorized = async (error: unknown, refreshFn: () => Promise<unknown>) => {
  handleErrorResponse(error).then(async (apiError) => {
    if (apiError) {
      switch (apiError.error_code) {
        case "UNAUTHORIZED":
          await refreshFn()
          break
      }
      return
    }
  })
}

export const QueryClientConfigurator = ({ children }: { children: React.ReactNode }) => {
  const { refetch } = useRefreshToken()

  useEffect(() => {
    setRefreshTokenHandler(refetch)
  }, [refetch])

  return children
}
