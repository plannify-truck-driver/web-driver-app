import type { SuspendedContent } from "@/shared/queries/auth/auth.types"
import { useTranslation } from "react-i18next"

export interface PageSuspendedProps {
  state: SuspendedContent
}

export default function PageSuspended({ state }: PageSuspendedProps) {
  const { t } = useTranslation()

  const from: Date = new Date(state.start_at)
  const to: Date | null = state.end_at ? new Date(state.end_at) : null

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-muted-foreground inline text-sm">
        {t("pages.authentication.suspended.description")}
      </p>
      <div className="flex w-full flex-col gap-2">
        <p>
          <span className="text-muted-foreground">
            {t("pages.authentication.suspended.message-label")}{" "}
          </span>
          {state.message}
        </p>
        <div className="gap flex flex-col">
          <p>
            <span className="text-muted-foreground">
              {t("pages.authentication.suspended.from-label")}{" "}
            </span>
            {t("pages.authentication.suspended.from-date", {
              date: from.toLocaleDateString(),
              time: from.toLocaleTimeString(),
            })}
          </p>
          <p>
            <span className="text-muted-foreground">
              {t("pages.authentication.suspended.to-label")}
            </span>{" "}
            {to
              ? t("pages.authentication.suspended.to-date", {
                  date: to.toLocaleDateString(),
                  time: to.toLocaleTimeString(),
                })
              : t("pages.authentication.suspended.to-undefined")}
          </p>
        </div>
      </div>
      <div className="w-full">
        <p>
          {t("pages.authentication.suspended.contact-support")}{" "}
          <a href="mailto:contact@plannify.be" className="text-primary underline">
            contact@plannify.be
          </a>
        </p>
      </div>
    </div>
  )
}
