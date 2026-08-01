import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

interface DevEnvironmentBannerProps {
  onDismiss: () => void
}

export function DevEnvironmentBanner({ onDismiss }: DevEnvironmentBannerProps) {
  const { t } = useTranslation()

  return (
    <div className="flex w-full shrink-0 items-center justify-between gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950">
      <div className="flex flex-col items-start">
        <p className="text-base font-bold">{t("components.dev-environment-banner.head-message")}</p>
        <p>{t("components.dev-environment-banner.description")}</p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 cursor-pointer rounded p-0.5 transition-colors hover:bg-amber-600/30"
        aria-label={t("components.dev-environment-banner.dismiss")}
      >
        <X size={14} />
      </button>
    </div>
  )
}
