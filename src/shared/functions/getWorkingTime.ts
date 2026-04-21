export const calculSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

export const getWorkdayTime = (start: string, end: string | undefined | null): number | null => {
  if (!end) return null

  if (start < end) {
    // start 05h00 - end 18h00
    return calculSeconds(end) - calculSeconds(start)
  } else {
    // start 18h00 - end 05h00
    return 24 * 3600 - (calculSeconds(start) - calculSeconds(end))
  }
}

export const getWorkingTime = (start: string, end: string | null, rest: string): number => {
  if (!end) return 0

  return getWorkdayTime(start, end)! - calculSeconds(rest)
}
