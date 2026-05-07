import { useTranslation } from "react-i18next"
import { LockIcon } from "lucide-react"

export function GeneratedBadge() {
  const { t } = useTranslation()
  return (
    <span className="bg-success/10 text-success inline-flex translate-y-px items-center gap-1 rounded-md px-2 py-1 text-xs">
      <LockIcon size={10} />
      {t("components.workday-document-item.generated")}
    </span>
  )
}
