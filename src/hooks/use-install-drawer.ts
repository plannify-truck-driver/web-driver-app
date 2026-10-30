import { useState, useCallback } from "react"

const STORAGE_KEY = "install-drawer"
const ONBOARDING_DURATION_MS = 7 * 24 * 60 * 60 * 1000
const MAX_DISMISSALS = 2

interface DrawerState {
  firstVisitAt: number
  count: number
  lastShownAt: number | null
}

function readState(): DrawerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as DrawerState
  } catch {
    // ignore
  }
  const state: DrawerState = { firstVisitAt: Date.now(), count: 0, lastShownAt: null }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
  return state
}

function isSameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function isOnboardingPeriod(state: DrawerState): boolean {
  return Date.now() - state.firstVisitAt < ONBOARDING_DURATION_MS && state.count < MAX_DISMISSALS
}

function canShowDrawer(state: DrawerState): boolean {
  if (!isOnboardingPeriod(state)) return false
  return state.lastShownAt === null || !isSameDay(state.lastShownAt, Date.now())
}

// First 7 days on this device: suggest the install in a drawer at the end of a workday,
// at most once a day. Afterwards (or after 2 dismissals) the dashboard banner takes over.
export function useInstallDrawer() {
  const [state, setState] = useState<DrawerState>(readState)

  const dismiss = useCallback(() => {
    setState((prev) => {
      const next: DrawerState = { ...prev, count: prev.count + 1, lastShownAt: Date.now() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { isOnboarding: isOnboardingPeriod(state), canShow: canShowDrawer(state), dismiss }
}
