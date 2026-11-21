import { QueryCache, QueryClient } from "@tanstack/react-query"
import { HTTPError } from "ky"
import { toast } from "sonner"
import i18n from "@/i18n"
import { authKeys } from "@/shared/queries/auth/auth.queries"

// 401 handling (token refresh + replay) lives in the ky client: see src/shared/lib/api.ts
export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({
    // Network failures, timeouts and 5xx show a single toast with a retry action.
    // 4xx are expected business answers (not found, forbidden...): the page handles them itself.
    // Opt out with `meta: { inlineError: true }` when the page renders its own error state.
    onError: (error, query) => {
      if (error instanceof HTTPError && error.response.status < 500) return
      if (query.meta?.inlineError) return
      if (query.queryKey.join(".") === authKeys.refreshToken().join(".")) return

      toast.error(i18n.t("common.load-error"), {
        id: "query-error",
        action: {
          label: i18n.t("common.retry"),
          onClick: () =>
            queryClient.refetchQueries({
              type: "active",
              predicate: (q) => q.state.status === "error",
            }),
        },
      })
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
    },
  },
})
