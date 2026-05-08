export const displayTime = (time?: string | null, showSeconds?: boolean): string => {
  if (!time) return "00:00"

  const [hours, minutes, seconds] = time.split(":")
  if (showSeconds) return `${hours}:${minutes}:${seconds ?? "00"}`
  return `${hours}:${minutes}`
}
