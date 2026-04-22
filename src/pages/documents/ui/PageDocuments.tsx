import { WorkdayDocumentGroup } from "@/shared/components/WorkdayDocumentGroup"
import type { WorkdayDocument } from "@/shared/models/workday"
import { useTranslation } from "react-i18next"

interface PageDocumentsProps {
  workdayDocuments?: Record<number, WorkdayDocument[] | undefined>
  fetchDocumentsByYear: (year: number) => void
  onGenerateDocument: (month: number, year: number) => void
  generatingDocument: { month: number; year: number } | undefined
}

export default function PageDocuments({
  workdayDocuments = {},
  fetchDocumentsByYear,
  onGenerateDocument,
  generatingDocument,
}: PageDocumentsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">{t("pages.documents.page-title")}</h1>
        <p className="text-muted-foreground text-sm">{t("pages.documents.page-description")}</p>
      </div>
      <div className="flex flex-col gap-3">
        {Object.entries(workdayDocuments)
          .sort(([a], [b]) => parseInt(b) - parseInt(a))
          .map(([year, documents]) => (
            <WorkdayDocumentGroup
              key={year}
              year={parseInt(year)}
              workdayDocuments={documents}
              fetchDocumentsByYear={fetchDocumentsByYear}
              onGenerateDocument={onGenerateDocument}
              generatingDocument={generatingDocument}
            />
          ))}
      </div>
    </div>
  )
}
