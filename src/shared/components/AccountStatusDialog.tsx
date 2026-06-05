import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/Drawer"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/Button"
import { XIcon } from "lucide-react"

interface AccountStatusDialogProps {
  mode: "deactivate" | "restore"
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isLoading: boolean
  deactivationDays?: number
  onConfirm: () => void
}

function AccountStatusDialogContent({
  mode,
  isLoading,
  deactivationDays,
  onConfirm,
  onClose,
}: Pick<AccountStatusDialogProps, "mode" | "isLoading" | "deactivationDays" | "onConfirm"> & {
  onClose: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        {mode === "deactivate"
          ? t("components.account-status-dialog.deactivate.description", {
              days: deactivationDays ?? "?",
            })
          : t("components.account-status-dialog.restore.description")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {t("components.account-status-dialog.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          isLoading={isLoading}
          variant={mode === "deactivate" ? "destructive" : "default"}
        >
          {mode === "deactivate"
            ? t("components.account-status-dialog.deactivate.confirm")
            : t("components.account-status-dialog.restore.confirm")}
        </Button>
      </div>
    </div>
  )
}

export function AccountStatusDialog({
  mode,
  isOpen,
  setIsOpen,
  isLoading,
  deactivationDays,
  onConfirm,
}: AccountStatusDialogProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const title =
    mode === "deactivate"
      ? t("components.account-status-dialog.deactivate.title")
      : t("components.account-status-dialog.restore.title")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">{title}</DialogDescription>
          </DialogHeader>
          <AccountStatusDialogContent
            mode={mode}
            isLoading={isLoading}
            deactivationDays={deactivationDays}
            onConfirm={onConfirm}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-1"
          >
            <XIcon size={16} />
          </button>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <AccountStatusDialogContent
            mode={mode}
            isLoading={isLoading}
            deactivationDays={deactivationDays}
            onConfirm={onConfirm}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
