import { WorkdayDocumentGroup } from "@/shared/components/WorkdayDocumentGroup"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import type { WorkdayDocument } from "@/shared/models/workday"
import { Trans, useTranslation } from "react-i18next"
import { LockIcon, RocketIcon, DatabaseIcon, ShieldCheckIcon, XIcon } from "lucide-react"
import { GeneratedBadge } from "@/shared/components/GeneratedBadge"
import { useState } from "react"
import { Button } from "@/shared/components/ui/Button"
import { useDocumentsBannerDismiss } from "@/hooks/use-documents-banner-dismiss"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/Dialog"

interface PageDocumentsProps {
  workdayDocuments?: Record<number, WorkdayDocument[] | undefined>
  isLoadingYears?: boolean
  fetchDocumentsByYear: (year: number) => void
  onGenerateDocument: (month: number, year: number) => void
  generatingDocument: { month: number; year: number } | undefined
  highlightYear?: number
  highlightMonth?: number
}

export default function PageDocuments({
  workdayDocuments = {},
  isLoadingYears = false,
  fetchDocumentsByYear,
  onGenerateDocument,
  generatingDocument,
  highlightYear,
  highlightMonth,
}: PageDocumentsProps) {
  const { t } = useTranslation()
  const [isWhyDialogOpen, setIsWhyDialogOpen] = useState(false)
  const { isVisible: isBannerVisible, dismiss: dismissBanner } = useDocumentsBannerDismiss()

  const hasGeneratedDocuments = Object.values(workdayDocuments).some((docs) =>
    docs?.some((doc) => doc.generated_at !== null)
  )

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">{t("pages.documents.page-title")}</h1>
        <p className="text-muted-foreground text-sm">{t("pages.documents.page-description")}</p>
      </div>
      {hasGeneratedDocuments && isBannerVisible && (
        <>
          <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-5">
            <LockIcon className="pointer-events-none absolute -right-3 -bottom-3 size-24 rotate-12 text-amber-500/8" />
            <button
              onClick={dismissBanner}
              className="text-muted-foreground/60 hover:text-muted-foreground absolute top-3 right-3 cursor-pointer rounded p-0.5 transition-colors"
              aria-label={t("pages.documents.generated-banner-dismiss")}
            >
              <XIcon size={14} />
            </button>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                <LockIcon className="size-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{t("pages.documents.generated-banner-title")}</p>
                <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">
                  <Trans
                    i18nKey="pages.documents.generated-banner-description"
                    components={{ badge: <GeneratedBadge /> }}
                  />
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-fit shrink-0"
                onClick={() => setIsWhyDialogOpen(true)}
              >
                {t("pages.documents.generated-banner-why")}
              </Button>
            </div>
          </div>

          <Dialog open={isWhyDialogOpen} onOpenChange={setIsWhyDialogOpen}>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle>{t("pages.documents.generated-why-dialog.title")}</DialogTitle>
                <DialogDescription>
                  {t("pages.documents.generated-why-dialog.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                    <RocketIcon className="text-primary size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t("pages.documents.generated-why-dialog.reason-speed-title")}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {t("pages.documents.generated-why-dialog.reason-speed-description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                    <DatabaseIcon className="text-primary size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t("pages.documents.generated-why-dialog.reason-performance-title")}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {t("pages.documents.generated-why-dialog.reason-performance-description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                    <ShieldCheckIcon className="text-primary size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t("pages.documents.generated-why-dialog.reason-integrity-title")}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {t("pages.documents.generated-why-dialog.reason-integrity-description")}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      <div className="flex flex-col gap-3">
        {isLoadingYears ? (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            ))}
          </>
        ) : (
          Object.entries(workdayDocuments)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([year, documents]) => (
              <WorkdayDocumentGroup
                key={year}
                year={parseInt(year)}
                workdayDocuments={documents}
                fetchDocumentsByYear={fetchDocumentsByYear}
                onGenerateDocument={onGenerateDocument}
                generatingDocument={generatingDocument}
                highlightYear={highlightYear}
                highlightMonth={highlightMonth}
              />
            ))
        )}
      </div>
    </div>
  )
}
