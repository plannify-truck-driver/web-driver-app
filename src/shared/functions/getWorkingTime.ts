import { calculSeconds } from "./calculSeconds"
import { getWorkdayTime } from "./getWorkdayTime"

export const getWorkingTime = (start: string, end: string | null, rest: string): number => {
  if (!end) return 0

  return getWorkdayTime(start, end)! - calculSeconds(rest)
}
