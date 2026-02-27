export const displayTime = (time?: string | null, onlyHourMinute?: boolean): string => {
  if (!time) return "00:00"

  const [hours, minutes] = time.split(":")
  return onlyHourMinute ? `${hours}:${minutes}` : `${time}`
}
