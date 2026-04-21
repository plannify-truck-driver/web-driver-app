import { calculSeconds } from "./calculSeconds"

export const getWorkdayTime = (start: string, end: string | undefined | null): number | null => {
  if (!end) return null

  if (start === end) return 0

  if (start < end) {
    // start 05h00 - end 18h00
    return calculSeconds(end) - calculSeconds(start)
  } else {
    // start 18h00 - end 05h00
    return 24 * 3600 - (calculSeconds(start) - calculSeconds(end))
  }
}
