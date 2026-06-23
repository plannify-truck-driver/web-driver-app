import { Button } from "@/shared/components/ui/Button"
import { Separator } from "@/shared/components/ui/Separator"
import type { RegistrationLimitationResponse } from "@/shared/queries/auth/auth.types"
import { useNavigate } from "@tanstack/react-router"
import { LockIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PageRegistrationClosedProps {
  limitation: RegistrationLimitationResponse
}

export default function PageRegistrationClosed({ limitation }: PageRegistrationClosedProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const from = new Date(limitation.start_at)
  const to = limitation.end_at ? new Date(limitation.end_at) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
          <LockIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            {t("pages.authentication.registration-closed.title")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("pages.authentication.registration-closed.description")}
          </p>
        </div>
      </div>

      <div className="bg-muted/50 border-border rounded-xl border px-4 py-3">
        <div className="flex items-center justify-between gap-4 py-1">
          <span className="text-muted-foreground text-sm">
            {t("pages.authentication.registration-closed.closed-since-label")}
          </span>
          <span className="text-sm font-medium">
            {t("pages.authentication.registration-closed.date", {
              date: from.toLocaleDateString(),
              time: from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            })}
          </span>
        </div>
        <Separator className="my-1" />
        <div className="flex items-center justify-between gap-4 py-1">
          <span className="text-muted-foreground text-sm">
            {t("pages.authentication.registration-closed.reopens-label")}
          </span>
          <span className="text-sm font-medium">
            {to
              ? t("pages.authentication.registration-closed.date", {
                  date: to.toLocaleDateString(),
                  time: to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                })
              : t("pages.authentication.registration-closed.reopens-undefined")}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate({ to: "/authentication/login" })}
      >
        {t("pages.authentication.registration-closed.back-to-login")}
      </Button>
    </div>
  )
}
