import { type UseFormReturn } from "react-hook-form"
import z from "zod"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/Dialog"
import { addRestPeriodFormSchema } from "@/shared/zod/add-rest-period"
import { AddRestPeriodForm } from "@/shared/forms/AddRestPeriod"

export interface AddPeriodDialogProps {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof addRestPeriodFormSchema>>
  nextStart: string
  onClose: () => void
  onSubmit: (values: z.infer<typeof addRestPeriodFormSchema>) => void
}

export function AddPeriodDialog({
  isOpen,
  form,
  onClose,
  nextStart,
  onSubmit,
}: AddPeriodDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("pages.settings.rest-preferences.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("pages.settings.rest-preferences.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <AddRestPeriodForm form={form} nextStart={nextStart} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
