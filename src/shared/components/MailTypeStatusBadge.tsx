import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

export function MailTypeStatusBadge({ status }: { status: boolean }) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        status
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/10 text-red-500 dark:text-red-400"
      )}
    >
      {t(`pages.account.mails.type-status.${status}`)}
    </span>
  )
}
