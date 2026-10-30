import { useState } from "react"
import { Download, Share, SquarePlus, Smartphone, WifiOff, Zap, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { Button } from "./ui/Button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/Drawer"

function InstallReasons({ small }: { small?: boolean }) {
  const { t } = useTranslation()
  const iconSize = small ? "size-3" : "size-4"

  return (
    <ul
      className={
        small ? "text-muted-foreground flex flex-col gap-1 text-xs" : "flex flex-col gap-2 text-sm"
      }
    >
      <li className="flex items-center gap-2">
        <Zap className={`${iconSize} shrink-0 text-amber-500`} />
        {t("components.install-banner.reason-fast")}
      </li>
      <li className="flex items-center gap-2">
        <SquarePlus className={`${iconSize} shrink-0 text-blue-500`} />
        {t("components.install-banner.reason-home-screen")}
      </li>
      <li className="flex items-center gap-2">
        <WifiOff className={`${iconSize} shrink-0 text-emerald-500`} />
        {t("components.install-banner.reason-offline")}
      </li>
    </ul>
  )
}

function IosSteps() {
  const { t } = useTranslation()

  return (
    <ol className="bg-muted/50 flex flex-col gap-1.5 rounded-lg border p-3 text-sm">
      <li className="flex items-center gap-2">
        <span className="text-muted-foreground">1.</span>
        {t("components.install-banner.ios-step-share")}
        <Share className="size-4 shrink-0 text-blue-500" />
      </li>
      <li className="flex items-center gap-2">
        <span className="text-muted-foreground">2.</span>
        {t("components.install-banner.ios-step-add")}
        <SquarePlus className="size-4 shrink-0" />
      </li>
    </ol>
  )
}

interface InstallDrawerProps {
  open: boolean
  onClose: () => void
}

export function InstallDrawer({ open, onClose }: InstallDrawerProps) {
  const { t } = useTranslation()
  const { canPrompt, isIos, install } = usePwaInstall()

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-sm flex-col">
          <DrawerHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-blue-500/15">
              <Smartphone className="size-6 text-blue-500" />
            </div>
            <DrawerTitle>{t("components.install-banner.drawer-title")}</DrawerTitle>
            <DrawerDescription>
              {t("components.install-banner.drawer-description")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4">
            <InstallReasons />
            {!canPrompt && isIos && <IosSteps />}
          </div>
          <DrawerFooter>
            {canPrompt && (
              <Button onClick={() => install().then(onClose)}>
                <Download className="size-4" />
                {t("components.install-banner.install-button")}
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              {t("components.install-banner.later")}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

interface InstallBannerProps {
  onDismiss: () => void
  variant: "sidebar" | "compact"
}

export function InstallBanner({ onDismiss, variant }: InstallBannerProps) {
  const { t } = useTranslation()
  const { canPrompt, isIos, install } = usePwaInstall()
  const [isIosDrawerOpen, setIsIosDrawerOpen] = useState(false)

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-gradient-to-br from-blue-500/5 to-blue-500/10 py-2 pr-2 pl-3">
        <Smartphone className="size-4 shrink-0 text-blue-500" />
        <p className="flex-1 text-sm leading-tight font-medium">
          {t("components.install-banner.compact-title")}
        </p>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => (canPrompt ? install() : setIsIosDrawerOpen(true))}
        >
          {t(
            canPrompt ? "components.install-banner.install-short" : "components.install-banner.how"
          )}
        </Button>
        <button
          onClick={onDismiss}
          className="text-muted-foreground/60 hover:text-muted-foreground cursor-pointer rounded p-0.5 transition-colors"
          aria-label={t("components.install-banner.dismiss")}
        >
          <X size={14} />
        </button>
        {isIos && (
          <InstallDrawer open={isIosDrawerOpen} onClose={() => setIsIosDrawerOpen(false)} />
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-3">
      <Smartphone className="pointer-events-none absolute -right-2 -bottom-2 size-14 rotate-12 text-blue-500/8" />
      <button
        onClick={onDismiss}
        className="text-muted-foreground/60 hover:text-muted-foreground absolute top-2 right-2 cursor-pointer rounded p-0.5 transition-colors"
        aria-label={t("components.install-banner.dismiss")}
      >
        <X size={12} />
      </button>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 pr-4">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <Smartphone className="size-3.5 text-blue-500" />
          </div>
          <p className="text-sm leading-tight font-semibold">
            {t("components.install-banner.title")}
          </p>
        </div>
        <InstallReasons small />
        {canPrompt ? (
          <Button size="sm" variant="outline" className="w-full text-xs" onClick={install}>
            <Download className="size-3" />
            {t("components.install-banner.install-button")}
          </Button>
        ) : (
          isIos && <IosSteps />
        )}
      </div>
    </div>
  )
}
