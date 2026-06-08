import { useState } from "react"
import {
  DriverPreferencesProviderContext,
  type DriverPreferences,
  type DriverPreferencesProviderState,
} from "./DriverPreferencesProviderContext"

export function DriverPreferencesProvider({ children, ...props }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<DriverPreferences>(() => {
    try {
      const raw = localStorage.getItem("driver-preferences")
      if (raw) {
        const parsed = parseInt(raw, 10)
        if (parsed === 1 || parsed === 2 || parsed === 3) {
          return { workdayTableRowType: parsed }
        }
      }
    } catch {
      // ignore localStorage errors (private browsing, quota exceeded, etc.)
    }
    return { workdayTableRowType: 1 }
  })

  const setPreferences = (preferences: DriverPreferences) => {
    localStorage.setItem("driver-preferences", String(preferences.workdayTableRowType))
    setPreferencesState(preferences)
  }

  const value: DriverPreferencesProviderState = {
    preferences,
    setPreferences,
  }

  return (
    <DriverPreferencesProviderContext.Provider value={value} {...props}>
      {children}
    </DriverPreferencesProviderContext.Provider>
  )
}
