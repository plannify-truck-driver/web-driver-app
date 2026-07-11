import ky from "ky"

let accessToken: string | null = null

export function setApiAccessToken(token: string | null) {
  accessToken = token
}

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 100000,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`)
        }
      },
    ],
  },
})
