import type { ErrorComponentProps } from "@tanstack/react-router"
import { TriangleAlertIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/shared/components/ui/Button"

// A stale service worker cache is the usual cause of a persistent startup crash:
// drop it so the reload fetches the current build from the network.
async function hardReload() {
  try {
    const registrations = (await navigator.serviceWorker?.getRegistrations()) ?? []
    await Promise.all(registrations.map((registration) => registration.unregister()))
    if ("caches" in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
    }
  } finally {
    window.location.reload()
  }
}

export function AppErrorFallback({ error }: ErrorComponentProps) {
  const { t } = useTranslation()
  const [isReloading, setIsReloading] = useState(false)

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#EF4444]/10">
        <TriangleAlertIcon className="text-[#EF4444]" size={26} />
      </div>
      <p className="text-lg font-medium">{t("common.app-error.title")}</p>
      <p className="text-muted-foreground max-w-md text-sm">{t("common.app-error.description")}</p>
      <Button
        disabled={isReloading}
        onClick={() => {
          setIsReloading(true)
          hardReload()
        }}
      >
        {t("common.app-error.reload")}
      </Button>
      <details className="text-muted-foreground w-full max-w-md text-left text-xs">
        <summary className="cursor-pointer">{t("common.app-error.details")}</summary>
        <pre className="bg-muted mt-2 overflow-auto rounded-md p-2 whitespace-pre-wrap">
          {error instanceof Error ? `${error.message}\n\n${error.stack ?? ""}` : String(error)}
          {`\n\n${navigator.userAgent}`}
        </pre>
      </details>
    </div>
  )
}
