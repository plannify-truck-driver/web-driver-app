import { ArrowLeftIcon, MailIcon, ClockIcon, InfoIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/shared/components/ui/Skeleton"

interface PageSupportProps {
  supportEmail: string | null
  driverEmail: string | null
  isLoading: boolean
  onBack: () => void
}

export default function PageSupport({
  supportEmail,
  driverEmail,
  isLoading,
  onBack,
}: PageSupportProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="sr-only">{t("common.back")}</span>
        </button>
        <h1 className="text-2xl font-semibold">{t("pages.account.support.page-title")}</h1>
      </div>

      <div className="flex max-w-lg flex-col gap-4">
        <div className="flex flex-col divide-y rounded-lg border">
          <div className="flex items-start gap-3 px-4 py-3">
            <MailIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground text-sm">
                {t("pages.account.support.email-label")}
              </p>
              {isLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                >
                  {supportEmail}
                </a>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 px-4 py-3">
            <InfoIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground text-sm">
                {t("pages.account.support.registration-email-label")}
              </p>
              {driverEmail ? (
                <p className="text-sm font-medium">{driverEmail}</p>
              ) : (
                <Skeleton className="h-4 w-40" />
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 px-4 py-3">
            <ClockIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground text-sm">
                {t("pages.account.support.response-time-label")}
              </p>
              <p className="text-sm font-medium">{t("pages.account.support.response-time-value")}</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm">{t("pages.account.support.description")}</p>
      </div>
    </div>
  )
}
