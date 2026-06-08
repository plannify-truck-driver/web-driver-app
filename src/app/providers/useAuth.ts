import { useContext } from "react"
import { AuthProviderContext } from "./AuthProviderContext"

export function useAuth() {
  return useContext(AuthProviderContext)
}
