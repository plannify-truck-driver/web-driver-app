import type { Information } from "@/shared/queries/informations/informations.types"
import type { TFunction } from "i18next"

export const getInformationPeriod = (
  information: Information,
  language: string,
  t: TFunction
): string => {
  const startDate = new Date(information.start_at)
  const endDate = new Date(information.end_at)

  const formatDate = (date: Date) =>
    date.toLocaleDateString(language, { day: "numeric", month: "long", year: "numeric" })
  const formatTime = (date: Date) =>
    date.toLocaleTimeString(language, { hour: "2-digit", minute: "2-digit" })
  const formatDateTime = (date: Date) =>
    t("pages.account.informations.date-time", { date: formatDate(date), time: formatTime(date) })

  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()

  if (isSameDay) {
    return t("pages.account.informations.period-same-day", {
      date: formatDate(startDate),
      start: formatTime(startDate),
      end: formatTime(endDate),
    })
  }

  return t("pages.account.informations.period", {
    start: formatDateTime(startDate),
    end: formatDateTime(endDate),
  })
}
