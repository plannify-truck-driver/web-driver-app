import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { AddWorkdayForm, type AddWorkdayFormLoadings } from "../forms/AddWorkday"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { TriangleAlertIcon, XIcon } from "lucide-react"
import type { RestPeriod } from "../models/rest-period"
import type { GetWorkdayCreationLimitResponse } from "../queries/workday/workday.types"
import { cn } from "@/lib/utils"
import { formatThousands } from "../functions/formatThousands"

export interface AddWorkdayDialog {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  restPeriods: RestPeriod[]
  loadings: AddWorkdayFormLoadings
  errorCode: string | null
  creationLimit: {
    response: GetWorkdayCreationLimitResponse
    percentage: number
  } | null
  setIsOpen: (state: boolean) => void
  onSubmit: (values: z.infer<typeof addWorkdayFormSchema>) => void
  onReplaceExistingWorkday: () => void
  onRestoreGarbageWorkday: () => void
  undoErrorCode: () => void
}

export function AddWorkdayDialog({
  isOpen,
  form,
  restPeriods,
  loadings,
  errorCode,
  creationLimit,
  setIsOpen,
  onSubmit,
  onReplaceExistingWorkday,
  onRestoreGarbageWorkday,
  undoErrorCode,
}: AddWorkdayDialog) {
  const { t } = useTranslation()

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("components.add-dorkday-dialog.title")}</DialogTitle>
            <DialogDescription>{t("components.add-dorkday-dialog.description")}</DialogDescription>
          </DialogHeader>
          {creationLimit && (
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <TriangleAlertIcon className="size-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{t("pages.workdays.creation-limit-banner.low-title")}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          creationLimit.percentage <= 10 ? "bg-red-500" : "bg-amber-500"
                        )}
                        style={{ width: `${Math.max(creationLimit.percentage, 2)}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
                      {formatThousands(creationLimit.response.remaining)}/
                      {formatThousands(creationLimit.response.limit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <AddWorkdayForm
            form={form}
            restPeriods={restPeriods}
            loadings={loadings}
            errorCode={errorCode}
            onSubmit={onSubmit}
            onReplaceExistingWorkday={onReplaceExistingWorkday}
            onRestoreGarbageWorkday={onRestoreGarbageWorkday}
            undoErrorCode={undoErrorCode}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{t("components.add-dorkday-dialog.title")}</DrawerTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-muted bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1"
          >
            <XIcon size={16} />
          </button>
        </DrawerHeader>
        <div
          className="flex flex-col gap-4 overflow-y-auto px-4"
          style={{ paddingBottom: "max(1rem, calc(1rem + env(safe-area-inset-bottom)))" }}
        >
          {creationLimit && (
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex-1">
                  <p className="text-sm">{t("pages.workdays.creation-limit-banner.low-title")}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          creationLimit.percentage <= 10 ? "bg-red-500" : "bg-amber-500"
                        )}
                        style={{ width: `${Math.max(creationLimit.percentage, 2)}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
                      {formatThousands(creationLimit.response.remaining)}/
                      {formatThousands(creationLimit.response.limit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <AddWorkdayForm
            form={form}
            restPeriods={restPeriods}
            loadings={loadings}
            errorCode={errorCode}
            onSubmit={onSubmit}
            onReplaceExistingWorkday={onReplaceExistingWorkday}
            onRestoreGarbageWorkday={onRestoreGarbageWorkday}
            undoErrorCode={undoErrorCode}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
