import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import PageDocuments from "../ui/PageDocuments"
import {
  useGenerateWorkdayDocument,
  useGetWorkdayDocuments,
  useGetWorkdayDocumentsByYears,
} from "@/shared/queries/documents/document.queries"
import { useMemo, useState } from "react"
import type { WorkdayDocument } from "@/shared/models/workday"
import { toast } from "sonner"

export default function PageDocumentsFeature() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  useDocumentTitle(t("pages.documents.page-title"))

  const { data: yearsDocument } = useGetWorkdayDocuments()
  const { mutate: generateWorkdayDocument } = useGenerateWorkdayDocument({
    onSuccess: (document: Blob) => {
      const url = URL.createObjectURL(document)
      window.open(url, "_blank")
    },
    onError: (error: Error) => {
      toast.error(t("pages.documents.generation-error"))
      console.error("Error generating document:", error)
    },
  })

  const [fetchedYears, setFetchedYears] = useState<number[]>([currentYear])
  const documents = useGetWorkdayDocumentsByYears({ years: fetchedYears })

  const workdayDocuments = useMemo<Record<number, WorkdayDocument[] | undefined>>(() => {
    if (!yearsDocument) return {}

    const map: Record<number, WorkdayDocument[] | undefined> = Object.fromEntries(
      [...new Set([...yearsDocument, currentYear])].map((year) => [year, undefined])
    )
    fetchedYears.forEach((year, index) => {
      const data = documents[index]?.data
      if (data !== undefined) {
        map[year] = data
      }
    })

    return map
  }, [yearsDocument, documents, fetchedYears, currentYear])

  const fetchDocumentsByYear = (year: number) => {
    setFetchedYears((prev) => (prev.includes(year) ? prev : [...prev, year]))
  }

  const generateDocument = (month: number, year: number) => {
    generateWorkdayDocument({ month, year })
  }

  return (
    <PageDocuments
      workdayDocuments={workdayDocuments}
      fetchDocumentsByYear={fetchDocumentsByYear}
      onGenerateDocument={generateDocument}
    />
  )
}
