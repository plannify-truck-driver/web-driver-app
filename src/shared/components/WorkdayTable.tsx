import { useDriverPreferences } from "@/app/providers/DriverPreferencesProvider"
import type { Workday } from "../models/workday"
import { WorkdayTableRow1 } from "./workdayTableRows/WorkdayTableRow1"
import { WorkdayTableRow2 } from "./workdayTableRows/WorkdayTableRow2"
import { WorkdayTableRow3 } from "./workdayTableRows/WorkdayTableRow3"
import type { PeriodOfTime } from "@/pages/dashboard/feature/PageIndexFeature"
import { useTranslation } from "react-i18next"

export interface WorkdayTableProps {
  workdays: Workday[]
  period: PeriodOfTime
}

export function WorkdayTable({ workdays, period }: WorkdayTableProps) {
  const { t } = useTranslation()
  const { preferences } = useDriverPreferences()

  const workdayTableRowsComponents = {
    1: WorkdayTableRow1,
    2: WorkdayTableRow2,
    3: WorkdayTableRow3,
  }

  const WorkdayTableRowComponent = workdayTableRowsComponents[preferences.workdayTableRowType]

  const workdaysDays = workdays.map((wd) => new Date(wd.date).getDay())

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground block font-mono text-sm uppercase sm:hidden">
        {t("components.workday-table.detail-summary")}
      </p>
      <div className="block sm:hidden">
        {Array.from(
          {
            length:
              Math.ceil((period.to.getTime() - period.from.getTime()) / (1000 * 60 * 60 * 24)) + 1,
          },
          (_, idx) => {
            const i = new Date(period.from.getTime() + idx * 24 * 60 * 60 * 1000)
            const workday = workdays.find(
              (wd) => new Date(wd.date).toDateString() === i.toDateString()
            )

            if ([0, 6].includes(i.getDay()) && !workday) {
              return null
            }

            return (
              <WorkdayTableRowComponent
                key={i.toDateString()}
                date={i}
                workday={workday}
                isFirst={i.getDate() === period.from.getDate()}
                isLast={
                  workdaysDays.includes(0)
                    ? i.getDay() === 0
                    : workdaysDays.includes(6)
                      ? i.getDay() === 6
                      : i.getDay() === 5
                }
                onClick={() => {}}
              />
            )
          }
        )}
      </div>
    </div>
  )
}
