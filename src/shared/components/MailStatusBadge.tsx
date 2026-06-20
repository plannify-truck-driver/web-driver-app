import { useTranslation } from "react-i18next"
import type { MailStatus } from "../queries/mails/mails.types"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<MailStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-red-500/10 text-red-500 dark:text-red-400",
}

export function StatusBadge({ status }: { status: MailStatus }) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
      )}
    >
      {t(`pages.account.mails.status.${status}`)}
    </span>
  )
}
