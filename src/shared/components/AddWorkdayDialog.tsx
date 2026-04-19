import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { AddWorkdayForm } from "../forms/AddWorkday"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { addWorkdayFormSchema } from "../zod/add-workday"
import { XIcon } from "lucide-react"

export interface AddWorkdayDialog {
  isOpen: boolean
  form: UseFormReturn<z.infer<typeof addWorkdayFormSchema>>
  isLoading: boolean
  setIsOpen: (state: boolean) => void
}

export function AddWorkdayDialog({ isOpen, form, isLoading, setIsOpen }: AddWorkdayDialog) {
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
            loading={isLoading}
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
          <div className="bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md">
            <XIcon size={16} />
          </div>
        </DrawerHeader>
        <div className="px-4">
          <AddWorkdayForm form={form} loading={isLoading} errorMessage={null} onSubmit={() => {}} />
        </div>
        <DrawerFooter className="pt-2">
          {/* <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
