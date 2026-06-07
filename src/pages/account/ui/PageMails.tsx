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
import type { Mail, MailStatus } from "@/shared/queries/mails/mails.types"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import type { TFunction } from "i18next"

interface PageMailsProps {
  mails: Mail[]
  isLoading: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onBack: () => void
}

const STATUS_STYLES: Record<MailStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-red-500/10 text-red-500 dark:text-red-400",
}

function StatusBadge({ status }: { status: MailStatus }) {
  const { t } = useTranslation()
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
      )}
    >
      {t(`pages.account.mails.status.${status}`)}
    </span>
  )
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

// ─── Mobile cards ─────────────────────────────────────────────────────────────

function MailCard({ mail }: { mail: Mail }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dateStr = mail.sent_at ?? mail.created_at

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3"
      onClick={() =>
        navigate({
          to: "/account/mails/$mailId",
          params: { mailId: mail.pk_driver_mail_id },
        })
      }
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug font-medium">{mailTypeLabel(mail.mail_type.label, t)}</p>
        <StatusBadge status={mail.status} />
      </div>
      {mail.description && (
        <div className="flex flex-col gap-0.5">
          <p className="text-muted-foreground line-clamp-2 text-sm">{mail.description}</p>
          <p className="text-muted-foreground/60 text-xs italic">
            {t("pages.account.mails.description-language-notice")}
          </p>
        </div>
      )}
      <div className="text-muted-foreground flex flex-row items-center justify-between gap-x-4 gap-y-1 text-xs">
        <span className="truncate">{mail.email_used}</span>
        <span>
          {mail.sent_at
            ? t("pages.account.mails.sent-at", { date: formatDate(dateStr, i18n.language) })
            : t("pages.account.mails.created-at", { date: formatDate(dateStr, i18n.language) })}
        </span>
      </div>
      {mail.attachments.length > 0 && (
        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <PaperclipIcon className="size-3" />
          {t("pages.account.mails.attachments", { count: mail.attachments.length })}
        </span>
      )}
    </div>
  )
}

function MailCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-64" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
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
        <div className="flex flex-col divide-y rounded-lg border sm:hidden">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <MailCardSkeleton key={i} />)
          ) : mails.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <MailIcon className="text-muted-foreground size-8" />
              <p className="text-muted-foreground text-sm">{t("pages.account.mails.empty")}</p>
            </div>
          ) : (
            mails.map((mail) => <MailCard key={mail.pk_driver_mail_id} mail={mail} />)
          )}
        </div>

        {/* Desktop */}
        <MailsTableDesktop mails={mails} isLoading={isLoading} />

        {pagination}
      </div>
    </div>
  )
}
