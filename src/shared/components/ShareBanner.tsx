import { Share2, ShieldCheck, GraduationCap, Code2, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/Button"
import { toast } from "sonner"

interface ShareBannerProps {
  onDismiss: () => void
  variant?: "sidebar" | "card"
}

async function handleShare(shareText: string, copiedLabel: string) {
  if (navigator.share) {
    try {
      await navigator.share({ text: shareText })
    } catch {
      // user cancelled
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareText)
      toast.success(copiedLabel)
    } catch {
      toast.error("Impossible de copier le lien")
    }
  }
}

export function ShareBanner({ onDismiss, variant = "card" }: ShareBannerProps) {
  const { t } = useTranslation()

  const shareText = t("components.share-banner.share-text", { url: window.location.origin })
  const copiedLabel = t("components.share-banner.copied")

  if (variant === "sidebar") {
    return (
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-violet-500/5 to-violet-500/10 p-3">
        <Share2 className="pointer-events-none absolute -right-2 -bottom-2 size-14 rotate-12 text-violet-500/8" />
        <button
          onClick={onDismiss}
          className="text-muted-foreground/60 hover:text-muted-foreground absolute top-2 right-2 cursor-pointer rounded p-0.5 transition-colors"
          aria-label={t("components.share-banner.dismiss")}
        >
          <X size={12} />
        </button>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 pr-4">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
              <Share2 className="size-3.5 text-violet-500" />
            </div>
            <p className="text-sm leading-tight font-semibold">
              {t("components.share-banner.title")}
            </p>
          </div>
          <ul className="text-muted-foreground flex flex-col gap-1 text-xs">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="size-3 shrink-0 text-emerald-500" />
              {t("components.share-banner.reason-free")}
            </li>
            <li className="flex items-center gap-1.5">
              <GraduationCap className="size-3 shrink-0 text-violet-500" />
              {t("components.share-banner.reason-student")}
            </li>
            <li className="flex items-center gap-1.5">
              <Code2 className="size-3 shrink-0 text-blue-500" />
              {t("components.share-banner.reason-opensource")}
            </li>
          </ul>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => handleShare(shareText, copiedLabel)}
          >
            <Share2 className="size-3" />
            {t("components.share-banner.share-button")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-500/5 to-violet-500/10 p-4">
      <Share2 className="pointer-events-none absolute -right-4 -bottom-4 size-28 rotate-12 text-violet-500/8" />
      <button
        onClick={onDismiss}
        className="text-muted-foreground/60 hover:text-muted-foreground absolute top-3 right-3 cursor-pointer rounded p-0.5 transition-colors"
        aria-label={t("components.share-banner.dismiss")}
      >
        <X size={14} />
      </button>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 pr-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
            <Share2 className="size-5 text-violet-500" />
          </div>
          <p className="text-sm font-bold leading-tight">{t("components.share-banner.title")}</p>
        </div>
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
            <span className="text-sm">{t("components.share-banner.reason-free")}</span>
          </li>
          <li className="flex items-center gap-2">
            <GraduationCap className="size-4 shrink-0 text-violet-500" />
            <span className="text-sm">{t("components.share-banner.reason-student")}</span>
          </li>
          <li className="flex items-center gap-2">
            <Code2 className="size-4 shrink-0 text-blue-500" />
            <span className="text-sm">{t("components.share-banner.reason-opensource")}</span>
          </li>
        </ul>
        <Button size="sm" className="w-full" onClick={() => handleShare(shareText, copiedLabel)}>
          <Share2 className="size-4" />
          {t("components.share-banner.share-button")}
        </Button>
      </div>
    </div>
  )
}
