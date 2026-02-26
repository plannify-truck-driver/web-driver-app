import type { Workday } from "@/shared/models/workday"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { Moon, Minus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table"
import { displayDuration } from "@/shared/functions/displayDuration"
import { displayTime } from "@/shared/functions/displayTime"

export interface WorkdayTableDesktopProps {
  workdays: Workday[]
}

export function WorkdayTableDesktop({ workdays }: WorkdayTableDesktopProps) {
  const { t, i18n } = useTranslation()

  const DEFAULT_COLUMNS: ColumnDef<Workday>[] = [
    {
      accessorKey: "date",
      header: t("components.workday-table-desktop.date"),
      cell: ({ row }) => {
        const value = row.getValue("date") as string | undefined
        return value
          ? new Date(value).toLocaleDateString(i18n.language, {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
          : null
      },
    },
    {
      accessorKey: "start_time",
      header: t("components.workday-table-desktop.start-time"),
      cell: ({ row }) => {
        const value = row.getValue("start_time") as string | undefined
        return value ? displayTime(value) : <Minus className="text-muted-foreground/80" size={16} />
      },
    },
    {
      accessorKey: "end_time",
      header: t("components.workday-table-desktop.end-time"),
      cell: ({ row }) => {
        const value = row.getValue("end_time") as string | undefined
        return value ? displayTime(value) : <Minus className="text-muted-foreground/80" size={16} />
      },
    },
    {
      accessorKey: "rest_time",
      header: t("components.workday-table-desktop.rest-time"),
      cell: ({ row }) => {
        const endTime = row.getValue("end_time") as string | null | undefined
        const value = row.getValue("rest_time") as string | undefined
        return endTime && value ? (
          displayDuration(value, t)
        ) : (
          <Minus className="text-muted-foreground/80" size={16} />
        )
      },
    },
    {
      accessorKey: "overnight_rest",
      header: t("components.workday-table-desktop.overnight-rest"),
      cell: ({ row }) => {
        const value = row.getValue("overnight_rest") as boolean | undefined
        return value ? (
          <Moon className="text-success" size={18} />
        ) : (
          <Minus className="text-muted-foreground/80" size={16} />
        )
      },
    },
  ]

  const table = useReactTable({
    data: workdays,
    columns: DEFAULT_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-sidebar hidden overflow-hidden rounded-md border sm:block">
      <Table>
        <TableHeader className="bg-table-header">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
