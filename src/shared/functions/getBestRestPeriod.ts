import type { RestPeriod } from "../models/rest-period"
import { calculSeconds } from "./calculSeconds"
import { getWorkdayTime } from "./getWorkdayTime"

export const getBestRestPeriod = (
  start: string,
  end: string,
  restPeriods: RestPeriod[]
): string | null => {
  const durationSeconds = getWorkdayTime(start, end)
  if (durationSeconds === null) return null

  const match = restPeriods.find(
    (period) =>
      durationSeconds >= calculSeconds(period.start) && durationSeconds <= calculSeconds(period.end)
  )

  return match?.rest ?? null
}
