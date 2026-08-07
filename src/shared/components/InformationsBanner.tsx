import { getInformationMessage } from "@/shared/functions/getInformationMessage"
import { getInformationPeriod } from "@/shared/functions/getInformationPeriod"
import { getVisibleInformations } from "@/shared/functions/getVisibleInformations"
import { replaceInformationVariables } from "@/shared/functions/replaceInformationVariables"
import type { Driver } from "@/shared/models/driver"
import type { Information } from "@/shared/queries/informations/informations.types"
import { InfoIcon, TriangleAlertIcon } from "lucide-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface InformationsBannerProps {
  informations: Information[]
  driver: Driver
}

export function InformationsBanner({ informations, driver }: InformationsBannerProps) {
  const { t, i18n } = useTranslation()

  const now = useMemo(() => new Date(), [])
  const visibleInformations = getVisibleInformations(informations, now)

  if (visibleInformations.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {visibleInformations.map((information, index) => {
        const rawMessage = getInformationMessage(information, i18n.language)
        if (!rawMessage) return null

        const message = replaceInformationVariables(rawMessage, driver)

        const isWarning = information.type === "WARNING"
        const period = getInformationPeriod(information, i18n.language, t)

        return (
          <div
            key={`${information.start_at}-${index}`}
            className={
              isWarning
                ? "to-background flex flex-col gap-2 rounded-lg border border-amber-200 bg-gradient-to-br from-amber-500/10 p-4 dark:border-amber-900/50"
                : "to-background flex flex-col gap-2 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-500/10 p-4 dark:border-blue-900/50"
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={
                  isWarning
                    ? "flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400"
                    : "flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400"
                }
              >
                {isWarning ? (
                  <TriangleAlertIcon className="size-4" />
                ) : (
                  <InfoIcon className="size-4" />
                )}
                {t(
                  isWarning
                    ? "pages.account.informations.warning-label"
                    : "pages.account.informations.info-label"
                )}
              </span>
              <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap">
                {period}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        )
      })}
    </div>
  )
}
