export const calculSeconds = (time: string): number => {
  const [hours, minutes, seconds = 0] = time.split(":").map(Number)
  return hours * 3600 + minutes * 60 + seconds
}
