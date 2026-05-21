import { Loader2, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Workday } from "@/shared/models/workday"
import { WorkdayTableRow1 } from "@/shared/components/workdayTableRows/WorkdayTableRow1"
import { WorkdayTableRow2 } from "@/shared/components/workdayTableRows/WorkdayTableRow2"
import { WorkdayTableRow3 } from "@/shared/components/workdayTableRows/WorkdayTableRow3"
import { cn } from "@/lib/utils"

const MOCK_WORKDAY: Workday = {
  date: "2025-05-21",
  start_time: "08:30",
  end_time: "17:00",
  rest_time: "1:00",
  overnight_rest: false,
}

const ROW_COMPONENTS = {
  1: WorkdayTableRow1,
  2: WorkdayTableRow2,
  3: WorkdayTableRow3,
} as const

interface RegistrationWorkdayStepProps {
  selectedRowType: 1 | 2 | 3
  onSelect: (type: 1 | 2 | 3) => void
  isCreating: boolean
}

export function RegistrationWorkdayStep({
  selectedRowType,
  onSelect,
  isCreating,
}: RegistrationWorkdayStepProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          {isCreating ? (
            <Loader2 className="text-primary size-4 animate-spin" />
          ) : (
            <Check className="text-success size-4" />
          )}
          <p className="text-muted-foreground text-sm">
            {isCreating
              ? t("pages.authentication.registration.workday-preferences.creating-account")
              : t("pages.authentication.registration.workday-preferences.account-created")}
          </p>
        </div>
        <h2 className="text-xl font-semibold">
          {t("pages.authentication.registration.workday-preferences.title")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("pages.authentication.registration.workday-preferences.description")}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {([1, 2, 3] as const).map((type) => {
          const Component = ROW_COMPONENTS[type]
          const isSelected = selectedRowType === type

          return (
            <button
              key={type}
              type="button"
              className={cn(
                "relative rounded-lg border-2 p-0.5 text-left transition-colors",
                isSelected ? "border-primary" : "border-border hover:border-primary/40"
              )}
              onClick={() => onSelect(type)}
            >
              {isSelected && (
                <div className="bg-primary absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full">
                  <Check className="size-3 text-white" />
                </div>
              )}
              <div className="pointer-events-none">
                <Component
                  workday={MOCK_WORKDAY}
                  date={new Date(MOCK_WORKDAY.date + "T00:00:00")}
                  isFirst
                  isLast
                  onClick={() => {}}
                />
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-muted-foreground text-xs">
        {t("pages.authentication.registration.workday-preferences.hint")}
      </p>
    </div>
  )
}
