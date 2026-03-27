import { ChevronDown, ChevronRight } from "lucide-react"
import type { WorkdayDocument } from "../models/workday"
import { Button } from "./ui/Button"
import { WorkdayDocumentItem } from "./WorkdayDocumentItem"
import { useTranslation } from "react-i18next"
import { useState } from "react"

export interface WorkdayDocumentGroupProps {
  year: number
  workdayDocuments: WorkdayDocument[] | undefined
  fetchDocumentsByYear: (year: number) => void
  onGenerateDocument: (month: number, year: number) => void
}

export function WorkdayDocumentGroup({
  year,
  workdayDocuments,
  fetchDocumentsByYear,
  onGenerateDocument,
}: WorkdayDocumentGroupProps) {
  const { t } = useTranslation()
  const today = new Date()

  const [isOpen, setIsOpen] = useState<boolean>(today.getFullYear() === year)

  const toggleOpen = () => {
    if (!isOpen) {
      fetchDocumentsByYear(year)
    }
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <p>{year}</p>
          <Button variant="ghost" size="sm" onClick={toggleOpen}>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </div>
        {workdayDocuments !== undefined && (
          <div>
            <p className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
              {t("components.workday-document-group.number-of-documents", {
                count: workdayDocuments.length,
              })}
            </p>
          </div>
        )}
      </div>
      {isOpen &&
        (workdayDocuments === undefined ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <WorkdayDocumentItem key={1} onGenerateDocument={onGenerateDocument} />
            <WorkdayDocumentItem key={2} onGenerateDocument={onGenerateDocument} />
            <WorkdayDocumentItem key={3} onGenerateDocument={onGenerateDocument} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workdayDocuments.map((workdayDocument) => (
                <WorkdayDocumentItem
                  key={workdayDocument.month}
                  workdayDocument={workdayDocument}
                  onGenerateDocument={onGenerateDocument}
                />
              ))}
            </div>
            {workdayDocuments.length === 0 && (
              <p className="text-muted-foreground text-center text-sm">
                {t("components.workday-document-group.no-documents")}
              </p>
            )}
          </>
        ))}
    </div>
  )
}
