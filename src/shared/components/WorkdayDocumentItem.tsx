import { useTranslation } from "react-i18next"
import type { WorkdayDocument } from "../models/workday"
import { Eye, FileText, Loader2 } from "lucide-react"
import { upperCaseFirstLetter } from "../functions/upperCaseFirstLetter"
import { Skeleton } from "./ui/Skeleton"
import { GeneratedBadge } from "./GeneratedBadge"
import { useEffect, useRef } from "react"

export interface WorkdayDocumentItemProps {
  workdayDocument?: WorkdayDocument
  onGenerateDocument: (month: number, year: number) => void
  isGenerating?: boolean
  isHighlighted?: boolean
}

export function WorkdayDocumentItem({
  workdayDocument,
  onGenerateDocument,
  isGenerating = false,
  isHighlighted = false,
}: WorkdayDocumentItemProps) {
  const { t, i18n } = useTranslation()
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isHighlighted])

  const documentDate = new Date(workdayDocument?.year || 0, (workdayDocument?.month || 1) - 1)
  const documentLabel = upperCaseFirstLetter(
    documentDate.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })
  )

  return (
    <div
      ref={itemRef}
      className={`flex flex-row items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors ${isHighlighted ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/30" : "bg-sidebar border-border"}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EF4444]/10">
        <FileText className="text-[#EF4444]" />
      </div>
      {workdayDocument === undefined ? (
        <div className="flex w-full flex-col items-start justify-between gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-30" />
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col gap-1">
            <p className="text-sm">{documentLabel}</p>
            <div className="text-muted-foreground flex flex-row items-center gap-2 text-xs">
              <p className="leading-none">{t("components.workday-document-item.description")}</p>
              {workdayDocument.generated_at && (
                <>
                  <span>&bull;</span>
                  <GeneratedBadge />
                </>
              )}
            </div>
          </div>
          <div>
            <button
              className="bg-primary cursor-pointer rounded-md px-3 py-2 text-white disabled:opacity-70"
              onClick={() => onGenerateDocument(workdayDocument.month, workdayDocument.year)}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
