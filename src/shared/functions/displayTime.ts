export const displayTime = (time?: string | null): string => {
  if (!time) return "00:00"

  const [hours, minutes] = time.split(":")
  return `${hours}:${minutes}`
}
