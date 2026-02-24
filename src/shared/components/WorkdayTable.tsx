import type { Workday } from "../models/workday"
import { WorkdayTableRow1 } from "./workdayTableRows/WorkdayTableRow1"
import { WorkdayTableRow2 } from "./workdayTableRows/WorkdayTableRow2"
import { WorkdayTableRow3 } from "./workdayTableRows/WorkdayTableRow3"

export interface WorkdayTableProps {
  workdays: Workday[]
}

export function WorkdayTable({ workdays }: WorkdayTableProps) {
  return (
    <div>
      {workdays.map((workday) => (
        <WorkdayTableRow1
          key={workday.date}
          workday={workday}
          isFirst={true}
          isLast={false}
          onClick={() => {}}
        />
      ))}
      <WorkdayTableRow1
        workday={undefined}
        date={new Date("2026-02-23")}
        isFirst={false}
        isLast={false}
        onClick={() => {}}
      />
      {workdays.map((workday) => (
        <WorkdayTableRow2
          key={workday.date}
          workday={workday}
          isFirst={false}
          isLast={false}
          onClick={() => {}}
        />
      ))}
      <WorkdayTableRow2
        workday={undefined}
        date={new Date("2026-02-23")}
        isFirst={false}
        isLast={false}
        onClick={() => {}}
      />
      {workdays.map((workday) => (
        <WorkdayTableRow3
          key={workday.date}
          workday={workday}
          isFirst={false}
          isLast={false}
          onClick={() => {}}
        />
      ))}
      <WorkdayTableRow3
        workday={undefined}
        date={new Date("2026-02-23")}
        isFirst={false}
        isLast={true}
        onClick={() => {}}
      />
    </div>
  )
}
