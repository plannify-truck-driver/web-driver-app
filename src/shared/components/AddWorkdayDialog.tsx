import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { AddWorkdayForm, type AddWorkdayFormLoadings } from "../forms/AddWorkday"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { XIcon } from "lucide-react"
import type { RestPeriod } from "../models/rest-period"

export interface AddWorkdayDialog {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  restPeriods: RestPeriod[]
  loadings: AddWorkdayFormLoadings
  setIsOpen: (state: boolean) => void
}

export function AddWorkdayDialog({
  isOpen,
  form,
  restPeriods,
  loadings,
  setIsOpen,
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
          <AddWorkdayForm
            form={form}
            restPeriods={restPeriods}
            loadings={loadings}
            errorMessage={null}
            onSubmit={() => {
              // TODO
            }}
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
        <div className="px-4">
          <AddWorkdayForm
            form={form}
            restPeriods={restPeriods}
            loadings={loadings}
            errorMessage={null}
            onSubmit={() => {}}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
