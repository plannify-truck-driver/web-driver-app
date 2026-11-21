import { QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import i18n from "@/i18n"
import { authKeys } from "@/shared/queries/auth/auth.queries"

// 401 handling (token refresh + replay) lives in the ky client: see src/shared/lib/api.ts
export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({
    // Any failed query (once the ky 401 refresh has been tried) shows a single toast with a retry action.
    // Opt out with `meta: { inlineError: true }` when the page renders its own error state.
    onError: (_error, query) => {
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
