import { WorkdayDocumentGroup } from "@/shared/components/WorkdayDocumentGroup"
import type { WorkdayDocument } from "@/shared/models/workday"
import { useTranslation } from "react-i18next"

interface PageDocumentsProps {
  workdayDocuments?: Partial<Record<number, WorkdayDocument[] | undefined>>
  fetchDocumentsByYear: (year: number) => void
  onGenerateDocument: (month: number, year: number) => void
}

export default function PageDocuments({
  workdayDocuments = {},
  fetchDocumentsByYear,
  onGenerateDocument,
}: PageDocumentsProps) {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const currentYearDocuments = workdayDocuments[currentYear]

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">{t("pages.documents.page-title")}</h1>
        <p className="text-muted-foreground text-sm">{t("pages.documents.page-description")}</p>
      </div>
      <div className="flex flex-col gap-3">
        <WorkdayDocumentGroup
          year={currentYear}
          workdayDocuments={currentYearDocuments}
          fetchDocumentsByYear={fetchDocumentsByYear}
          onGenerateDocument={onGenerateDocument}
        />
        {Object.entries(workdayDocuments)
          .filter(([year]) => year !== String(currentYear))
          .map(([year, documents = []]) => (
            <WorkdayDocumentGroup
              key={`${year}-documents-${documents.length}`}
              year={parseInt(year)}
              workdayDocuments={documents}
              fetchDocumentsByYear={fetchDocumentsByYear}
              onGenerateDocument={onGenerateDocument}
            />
          ))}
      </div>
    </div>
  )
}
