import { createContext } from "react"

export interface DriverPreferences {
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

export const DriverPreferencesProviderContext =
  createContext<DriverPreferencesProviderState>(initialState)
