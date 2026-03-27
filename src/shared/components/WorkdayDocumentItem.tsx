import { useTranslation } from "react-i18next"
import type { WorkdayDocument } from "../models/workday"
import { Eye, FileText, Loader2, Lock } from "lucide-react"
import { upperCaseFirstLetter } from "../functions/upperCaseFirstLetter"
import { Skeleton } from "./ui/Skeleton"

export interface WorkdayDocumentItemProps {
  workdayDocument?: WorkdayDocument
  onGenerateDocument: (month: number, year: number) => void
  isGenerating?: boolean
}

export function WorkdayDocumentItem({
  workdayDocument,
  onGenerateDocument,
  isGenerating = false,
}: WorkdayDocumentItemProps) {
  const { t, i18n } = useTranslation()

  const documentDate = new Date(workdayDocument?.year || 0, (workdayDocument?.month || 1) - 1)
  const documentLabel = upperCaseFirstLetter(
    documentDate.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })
  )

  return (
    <div className="bg-sidebar border-border flex flex-row items-center justify-between gap-3 rounded-lg border px-4 py-3">
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
                  <p className="bg-success/10 text-success flex items-center gap-1 rounded-md px-2 py-1 text-xs">
                    <Lock size={12} />
                    {t("components.workday-document-item.generated")}
                  </p>
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
