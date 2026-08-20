import { useCallback, useState } from "react"

const STORAGE_KEY = "end-workday-rest-dialog-dismissed"

export function useEndWorkdayRestDialogDismissed() {
  const [isDismissed, setIsDismissedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true"
    } catch {
      return false
    }
  })

  const setIsDismissed = useCallback((value: boolean) => {
    setIsDismissedState(value)
    localStorage.setItem(STORAGE_KEY, value.toString())
  }, [])

  return { isDismissed, setIsDismissed }
}
