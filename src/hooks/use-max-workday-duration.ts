import { useCallback, useState } from "react"

const STORAGE_KEY = "max-workday-duration-hours"
const DEFAULT_MAX_HOURS = 18

function readMaxHours(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_MAX_HOURS
    const parsed = parseInt(raw, 10)
    return isNaN(parsed) ? DEFAULT_MAX_HOURS : parsed
  } catch {
    return DEFAULT_MAX_HOURS
  }
}

export function useMaxWorkdayDuration() {
  const [maxHours, setMaxHoursState] = useState<number>(readMaxHours)

  const setMaxHours = useCallback((hours: number) => {
    setMaxHoursState(hours)
    localStorage.setItem(STORAGE_KEY, hours.toString())
  }, [])

  return { maxHours, setMaxHours }
}
