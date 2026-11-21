import ky from "ky"

let accessToken: string | null = null
let refreshAccessToken: (() => Promise<boolean>) | null = null

export function setApiAccessToken(token: string | null) {
  accessToken = token
}

// Registered by AuthProvider: refreshes the session and calls login() so React state stays in sync.
export function setApiRefreshHandler(handler: () => Promise<boolean>) {
  refreshAccessToken = handler
}

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 100000,
  credentials: "include",
  hooks: {
    beforeRequest: [
      // Also runs on retries, so a retried request picks up the refreshed token.
      (request) => {
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`)
        }
      },
    ],
    afterResponse: [
      // Expired access token: refresh once, then replay the request transparently,
      // so callers (React Query) never see the 401.
      async (request, _options, response, state) => {
        if (response.status !== 401 || state.retryCount > 0 || !refreshAccessToken) return
        if (new URL(request.url).pathname.includes("/authentication/")) return

        const body = await response.json<{ error_code?: string }>().catch(() => null)
        if (body?.error_code !== "UNAUTHORIZED") return

        if (await refreshAccessToken()) return ky.retry({ code: "TOKEN_REFRESHED" })
      },
    ],
  },
})
