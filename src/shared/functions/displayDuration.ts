import type { TFunction } from "i18next"

export const displayDuration = (time: string | null, t: TFunction): string => {
  if (!time) return "0h 0min"

  const [hours, minutes] = time.split(":").map(Number)

  if (hours === 0) return t("pages.dashboard.minutes-time-format", { minutes })
  if (minutes === 0) return t("pages.dashboard.hour-time-format", { hours })

  return t("pages.dashboard.full-time-format", {
    hours: Math.round(hours),
    minutes: String(Math.round(minutes)).padStart(2, "0"),
  })
}
