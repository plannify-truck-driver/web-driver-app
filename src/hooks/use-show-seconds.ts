import { useCallback, useState } from "react"

const STORAGE_KEY = "show-seconds"

export function useShowSeconds() {
  const [showSeconds, setShowSecondsState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })

  const setShowSeconds = useCallback((value: boolean) => {
    setShowSecondsState(value)
    localStorage.setItem(STORAGE_KEY, value.toString())
  }, [])

  return { showSeconds, setShowSeconds }
}
