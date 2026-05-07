import { useState, useCallback } from "react"

const STORAGE_KEY = "rest-period-banner-dismiss"
const MAX_DISMISSALS = 5
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000

interface DismissState {
  count: number
  lastDismissedAt: number | null
}

function readState(): DismissState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, lastDismissedAt: null }
    return JSON.parse(raw) as DismissState
  } catch {
    return { count: 0, lastDismissedAt: null }
  }
}

function isBannerVisible(state: DismissState): boolean {
  if (state.count >= MAX_DISMISSALS) return false
  if (state.lastDismissedAt === null) return true
  return Date.now() - state.lastDismissedAt >= DISMISS_DURATION_MS
}

export function useRestPeriodBannerDismiss() {
  const [state, setState] = useState<DismissState>(readState)

  const dismiss = useCallback(() => {
    setState((prev) => {
      const next: DismissState = {
        count: prev.count + 1,
        lastDismissedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { isVisible: isBannerVisible(state), dismiss }
}
