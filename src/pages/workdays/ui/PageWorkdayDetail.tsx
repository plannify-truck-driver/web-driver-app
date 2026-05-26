import { useState } from "react"
import { type UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ArrowLeftIcon, LockIcon, SaveIcon, Trash2Icon, X } from "lucide-react"
import z from "zod"
import { editWorkdayFormSchema } from "@/shared/zod/edit-workday"
import { FieldGroup } from "@/shared/components/ui/Field"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/Dialog"
import type { Workday } from "@/shared/models/workday"
import type { RestPeriod } from "@/shared/models/rest-period"
import { WorkdayFormFields, type WorkdayFieldValues } from "@/shared/forms/WorkdayFormFields"
import { useConfig } from "@/shared/queries/config/config.queries"

interface PageWorkdayDetailProps {
  workdayDate: string
  workday: Workday | null
  isLoading: boolean
  restPeriods: RestPeriod[]
  isLoadingRestPeriods: boolean
  form: UseFormReturn<z.infer<typeof editWorkdayFormSchema>>
  isUpdating: boolean
  isDeleting: boolean
  onSave: (values: z.infer<typeof editWorkdayFormSchema>) => void
  onDelete: () => void
  showDocumentGeneratedError: boolean
  onDismissDocumentGeneratedError: () => void
}

export default function PageWorkdayDetail({
  workdayDate,
  workday,
  isLoading,
  restPeriods,
  isLoadingRestPeriods,
  form,
  isUpdating,
  isDeleting,
  onSave,
  onDelete,
  showDocumentGeneratedError,
  onDismissDocumentGeneratedError,
}: PageWorkdayDetailProps) {
  const { t, i18n } = useTranslation()
  const { data: config } = useConfig()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const formattedDate = new Date(workdayDate + "T00:00:00").toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-8 w-48 rounded-md" />
        </div>
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      </div>
    )
  }

  if (!workday) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <h1 className="text-2xl font-semibold">{t("pages.workdays.detail.page-title")}</h1>
        </div>
        <p className="text-muted-foreground">{t("pages.workdays.detail.not-found")}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
            >
              <ArrowLeftIcon className="size-5" />
              <span className="sr-only">{t("common.back")}</span>
            </button>
            <h1 className="text-xl font-semibold capitalize">{formattedDate}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2Icon />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSave)} className="flex flex-col gap-6">
          <FieldGroup className="flex flex-col gap-5">
            <WorkdayFormFields
              form={form as unknown as UseFormReturn<WorkdayFieldValues>}
              restPeriods={restPeriods}
              isLoadingRestPeriods={isLoadingRestPeriods}
              disabled={isUpdating}
            />
          </FieldGroup>

          {showDocumentGeneratedError && !isDeleteDialogOpen && (
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
                    month: new Date(workdayDate + "T00:00:00").toLocaleDateString(i18n.language, {
                      month: "long",
                    }),
                    year: new Date(workdayDate + "T00:00:00").getFullYear(),
                  })}
                </p>
              </div>
            </div>
          )}
          <Button
            type="submit"
            disabled={!form.formState.isDirty || isUpdating}
            isLoading={isUpdating}
            className="w-full"
          >
            <SaveIcon />
            {t("pages.workdays.detail.save")}
          </Button>
        </form>
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>{t("pages.workdays.detail.delete-dialog.title")}</DialogTitle>
            {showDocumentGeneratedError ? (
              <DialogDescription>
                {t("pages.workdays.errors.workday-document-already-generated", {
                  month: new Date(workdayDate + "T00:00:00").toLocaleDateString(i18n.language, {
                    month: "long",
                  }),
                  year: new Date(workdayDate + "T00:00:00").getFullYear(),
                })}
              </DialogDescription>
            ) : (
              <DialogDescription>
                {t("pages.workdays.detail.delete-dialog.description", {
                  retentionDays: config ? config.workday_garbage_retention_days : 30,
                })}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            {showDocumentGeneratedError ? (
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t("pages.workdays.detail.delete-dialog.okay")}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  {t("pages.workdays.detail.delete-dialog.cancel")}
                </Button>
                <Button variant="destructive" isLoading={isDeleting} onClick={onDelete}>
                  {t("pages.workdays.detail.delete-dialog.confirm")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
