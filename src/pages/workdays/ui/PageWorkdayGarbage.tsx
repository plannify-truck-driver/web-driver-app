import { useTranslation } from "react-i18next"
import { Trash2Icon, RotateCcwIcon, LockIcon, X, ArrowLeftIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { WorkdayGarbage } from "@/shared/models/workday"
import { cn } from "@/lib/utils"

interface PageWorkdayGarbageProps {
  garbageWorkdays: WorkdayGarbage[]
  isLoading: boolean
  isRestoring: boolean
  onRestore: (date: string) => void
  documentGeneratedErrorDate: string | null
  onDismissDocumentGeneratedError: () => void
}

function getDaysRemaining(scheduledDeletionDate: string): number {
  const deletion = new Date(scheduledDeletionDate)
  const now = new Date()
  const diff = deletion.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function PageWorkdayGarbage({
  garbageWorkdays,
  isLoading,
  isRestoring,
  onRestore,
  documentGeneratedErrorDate,
  onDismissDocumentGeneratedError,
}: PageWorkdayGarbageProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex h-full flex-1 flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
          >
            <ArrowLeftIcon className="size-5" />
            <span className="sr-only">{t("common.back")}</span>
          </button>
          <h1 className="text-2xl font-semibold">{t("pages.workdays.garbage.page-title")}</h1>
        </div>
        <p className="text-muted-foreground text-sm">{t("pages.workdays.garbage.description")}</p>
      </div>

      {documentGeneratedErrorDate && (
        <div className="from-destructive/5 to-destructive/10 relative overflow-hidden rounded-xl border bg-gradient-to-br p-4">
          <button
            onClick={onDismissDocumentGeneratedError}
            className="text-muted-foreground/60 hover:text-muted-foreground absolute top-3 right-3 cursor-pointer rounded p-0.5 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-start gap-3 pr-4 sm:items-center">
            <div className="bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-full">
              <LockIcon className="text-destructive size-4" />
            </div>
            <p className="text-sm leading-relaxed">
              {t("pages.workdays.errors.workday-document-already-generated", {
                month: new Date(documentGeneratedErrorDate + "T00:00:00").toLocaleDateString(
                  i18n.language,
                  { month: "long" }
                ),
                year: new Date(documentGeneratedErrorDate + "T00:00:00").getFullYear(),
              })}
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : garbageWorkdays.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full">
            <Trash2Icon className="text-muted-foreground size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{t("pages.workdays.garbage.empty-title")}</p>
            <p className="text-muted-foreground text-sm">
              {t("pages.workdays.garbage.empty-description")}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile list */}
          <div className="flex flex-col sm:hidden">
            {garbageWorkdays.map((item, idx) => {
              const daysRemaining = getDaysRemaining(item.scheduled_deletion_date)
              const isUrgent = daysRemaining <= 7

              return (
                <div
                  key={item.workday_date}
                  className={cn(
                    "bg-sidebar border-border flex flex-row items-center justify-between gap-3 border-x border-t px-4 py-3",
                    idx === 0 && "rounded-tl-lg rounded-tr-lg",
                    idx === garbageWorkdays.length - 1 && "rounded-br-lg rounded-bl-lg border-b"
                  )}
                >
                  <p className="text-sm capitalize">
                    {new Date(item.workday_date + "T00:00:00").toLocaleDateString(i18n.language, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        isUrgent
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {t("pages.workdays.garbage.days-remaining", { count: daysRemaining })}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onRestore(item.workday_date)}
                      disabled={isRestoring}
                    >
                      <RotateCcwIcon />
                      <span className="sr-only">{t("pages.workdays.garbage.restore")}</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop table */}
          <div className="bg-sidebar hidden overflow-hidden rounded-md border sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-table-header border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {t("pages.workdays.garbage.table.date")}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {t("pages.workdays.garbage.table.deleted-on")}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {t("pages.workdays.garbage.table.permanent-deletion")}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {t("pages.workdays.garbage.table.remaining")}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {garbageWorkdays.map((item) => {
                  const daysRemaining = getDaysRemaining(item.scheduled_deletion_date)
                  const isUrgent = daysRemaining <= 7

                  return (
                    <tr key={item.workday_date} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium capitalize">
                        {new Date(item.workday_date + "T00:00:00").toLocaleDateString(
                          i18n.language,
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {new Date(item.created_at).toLocaleDateString(i18n.language, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {new Date(item.scheduled_deletion_date).toLocaleDateString(i18n.language, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            isUrgent
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground",
                          ].join(" ")}
                        >
                          {t("pages.workdays.garbage.days-remaining", { count: daysRemaining })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRestore(item.workday_date)}
                          disabled={isRestoring}
                        >
                          <RotateCcwIcon />
                          {t("pages.workdays.garbage.restore")}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
