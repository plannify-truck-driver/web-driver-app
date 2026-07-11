import { useContext } from "react"
import { DriverPreferencesProviderContext } from "./DriverPreferencesProviderContext"

export function useDriverPreferences() {
  const ctx = useContext(DriverPreferencesProviderContext)
  if (!ctx) throw new Error("useDriverPreferences must be used within DriverPreferencesProvider")
  return ctx
}
