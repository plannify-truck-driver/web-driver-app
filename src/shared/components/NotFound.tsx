import { Link } from "@tanstack/react-router"
import { MapPinOffIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/Button"

export function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4 p-6">
      <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full">
        <MapPinOffIcon className="text-muted-foreground size-6" />
      </div>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="font-semibold">{t("common.not-found.title")}</p>
        <p className="text-muted-foreground text-sm">{t("common.not-found.description")}</p>
      </div>
      <div>
        <Button variant="default" size="sm" asChild>
          <Link to="/dashboard">{t("common.not-found.back-home")}</Link>
        </Button>
      </div>
    </div>
  )
}
