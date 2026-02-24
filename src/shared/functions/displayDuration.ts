import type { TFunction } from "i18next"

export const displayDuration = (time: string | null, t: TFunction): string => {
  if (!time) return "0h 0min"

  const [hours, minutes] = time.split(":")
  const hoursNum = Number(hours)
  const minutesNum = Number(minutes)

  if (minutesNum > 0) {
    return t("pages.dashboard.time-format", {
      hours: Math.round(hoursNum),
      minutes: Math.round(minutesNum),
    })
  }

  return `${Math.round(hoursNum)}h`
}
