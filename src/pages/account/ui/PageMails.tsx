import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MailIcon,
  Minus,
  PaperclipIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/Table"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import type { Mail } from "@/shared/queries/mails/mails.types"
import { useNavigate } from "@tanstack/react-router"
import type { TFunction } from "i18next"
import { StatusBadge } from "@/shared/components/MailStatusBadge"
import { MailCard } from "@/shared/components/MailCard"

interface PageMailsProps {
  mails: Mail[]
  isLoading: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onBack: () => void
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function mailTypeLabel(label: string, t: TFunction) {
  return t(`pages.account.mails.types.${label}`, { defaultValue: label })
}

// ─── Desktop table ─────────────────────────────────────────────────────────────

function MailsTableDesktop({ mails, isLoading }: { mails: Mail[]; isLoading: boolean }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const columns: ColumnDef<Mail>[] = [
    {
      accessorKey: "mail_type",
      header: t("pages.account.mails.table.type"),
      cell: ({ row }) => mailTypeLabel(row.original.mail_type.label, t),
    },
    {
      accessorKey: "description",
      header: t("pages.account.mails.table.description"),
      cell: ({ row }) => {
        const desc = row.original.description
        return desc ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground line-clamp-2 text-sm">{desc}</span>
            <span className="text-muted-foreground/60 text-xs italic">
              {t("pages.account.mails.description-language-notice")}
            </span>
          </div>
        ) : (
          <Minus className="text-muted-foreground/80" size={16} />
        )
      },
    },
    {
      accessorKey: "email_used",
      header: t("pages.account.mails.table.email"),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email_used}</span>,
    },
    {
      accessorKey: "date",
      header: t("pages.account.mails.table.date"),
      cell: ({ row }) => {
        const dateStr = row.original.sent_at ?? row.original.created_at
        return (
          <span className="text-muted-foreground whitespace-nowrap">
            {formatDate(dateStr, i18n.language)}
          </span>
        )
      },
    },
    {
      accessorKey: "attachments",
      header: t("pages.account.mails.table.attachments"),
      cell: ({ row }) => {
        const count = row.original.attachments.length
        return count > 0 ? (
          <span className="text-muted-foreground flex items-center gap-1">
            <PaperclipIcon className="size-3.5" />
            {count}
          </span>
        ) : (
          <Minus className="text-muted-foreground/80" size={16} />
        )
      },
    },
    {
      accessorKey: "status",
      header: t("pages.account.mails.table.status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: mails,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-sidebar hidden overflow-hidden rounded-md border sm:block">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-table-header hover:bg-table-header">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-52" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
              </TableRow>
            ))
          ) : mails.length === 0 ? (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="text-center">
                {t("pages.account.mails.empty")}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() =>
                  navigate({
                    to: "/account/mails/$mailId",
                    params: { mailId: row.original.pk_driver_mail_id },
                  })
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PageMails({
  mails,
  isLoading,
  page,
  totalPages,
  total,
  onPageChange,
  onBack,
}: PageMailsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const pagination = totalPages > 1 && (
    <div className="flex items-center justify-between pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1 || isLoading}
      >
        <ChevronLeftIcon className="size-4" />
        {t("common.pagination.previous")}
      </Button>
      <span className="text-muted-foreground hidden text-sm sm:inline-flex">
        {t("common.pagination.page", { page, total: totalPages })}&nbsp;-&nbsp;
        {t("common.pagination.per-page", { count: mails.length })}
      </span>
      <span className="text-muted-foreground inline-flex text-sm sm:hidden">
        {t("common.pagination.page", { page, total: totalPages })}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages || isLoading}
      >
        {t("common.pagination.next")}
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="sr-only">{t("common.back")}</span>
        </button>
        <h1 className="text-2xl font-semibold">{t("pages.account.mails.page-title")}</h1>
      </div>

      <div className="flex flex-row items-center justify-between">
        <p className="text-muted-foreground font-mono text-sm uppercase">
          {t("pages.account.mails.preferences-management")}
        </p>

        <Button variant="outline" onClick={() => navigate({ to: "/account/mails/preferences" })}>
          {t("pages.account.mails.preferences-management")}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground font-mono text-sm uppercase">
            {t("pages.account.mails.mail-sent")}
          </p>
          {!isLoading && total > 0 && (
            <span className="text-muted-foreground text-xs">
              {t("pages.account.mails.total", { count: total })}
            </span>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col sm:hidden">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <MailCard key={i} isFirst={i === 0} isLast={i === 4} />
            ))
          ) : mails.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <MailIcon className="text-muted-foreground size-8" />
              <p className="text-muted-foreground text-sm">{t("pages.account.mails.empty")}</p>
            </div>
          ) : (
            mails.map((mail, index) => (
              <MailCard
                key={mail.pk_driver_mail_id}
                mail={mail}
                isFirst={index === 0}
                isLast={index === mails.length - 1}
              />
            ))
          )}
        </div>

        {/* Desktop */}
        <MailsTableDesktop mails={mails} isLoading={isLoading} />

        {pagination}
      </div>
    </div>
  )
}
