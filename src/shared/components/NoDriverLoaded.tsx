import { UserRoundXIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

export function NoDriverLoaded() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EF4444]/10">
          <UserRoundXIcon className="text-[#EF4444]" size={22} />
        </div>
        <p className="text-lg font-medium">{t("components.no-driver-loaded.title")}</p>
      </div>
      <p className="text-muted-foreground text-center text-sm">
        {t("components.no-driver-loaded.description")}
      </p>
    </div>
  )
}
