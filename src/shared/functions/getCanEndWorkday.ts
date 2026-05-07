import type { Workday } from "@/shared/models/workday"

export function isWithinWorkdayWindow(workday: Workday, maxHours: number): boolean {
  const startDatetime = new Date(`${workday.date}T${workday.start_time}`)
  const elapsedMs = Date.now() - startDatetime.getTime()
  return elapsedMs <= maxHours * 60 * 60 * 1000
}

export function getCanEndWorkday(workday: Workday | null, maxHours: number): boolean {
  if (!workday || workday.end_time) return false
  return isWithinWorkdayWindow(workday, maxHours)
}
