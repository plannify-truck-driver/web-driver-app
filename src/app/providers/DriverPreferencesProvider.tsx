import { createContext, useContext, useState } from "react"

interface DriverPreferences {
  workdayTableRowType: 1 | 2 | 3
}

export interface DriverPreferencesProviderState {
  preferences: DriverPreferences
  setPreferences: (preferences: DriverPreferences) => void
}

const initialState: DriverPreferencesProviderState = {
  preferences: {
    workdayTableRowType: 1,
  },
  setPreferences: () => null,
}

const DriverPreferencesProviderContext = createContext<DriverPreferencesProviderState>(initialState)

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
    } catch {}
    return initialState.preferences
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

export function useDriverPreferences() {
  const ctx = useContext(DriverPreferencesProviderContext)
  if (!ctx) throw new Error("useDriverPreferences must be used within DriverPreferencesProvider")
  return ctx
}
