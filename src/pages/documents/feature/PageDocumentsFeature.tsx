import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import PageDocuments from "../ui/PageDocuments"
import { useGetWorkdayDocuments, workdayDocumentsKeys } from "@/shared/queries/documents/document.queries"
import { getWorkdayDocumentsByYear } from "@/shared/queries/documents/document.api"
import { useMemo, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import type { WorkdayDocument } from "@/shared/models/workday"

export default function PageDocumentsFeature() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  useDocumentTitle(t("pages.documents.page-title"))

  const { data: yearsDocument } = useGetWorkdayDocuments()

  const [fetchedYears, setFetchedYears] = useState<number[]>([currentYear])

  const yearQueries = useQueries({
    queries: fetchedYears.map((year) => ({
      queryKey: workdayDocumentsKeys.getWorkdayDocumentsByYear({ year }),
      queryFn: () => getWorkdayDocumentsByYear({ year }),
    })),
  })

  const workdayDocuments = useMemo<Partial<Record<number, WorkdayDocument[] | undefined>>>(() => {
    const years = yearsDocument ?? []
    const map: Partial<Record<number, WorkdayDocument[] | undefined>> = Object.fromEntries(
      [...new Set([...years, currentYear])].map((year) => [year, undefined])
    )
    fetchedYears.forEach((year, index) => {
      const data = yearQueries[index]?.data
      if (data !== undefined) {
        map[year] = data
      }
    })
    return map
  }, [yearsDocument, yearQueries, fetchedYears, currentYear])

  const fetchDocumentsByYear = (year: number) => {
    setFetchedYears((prev) => (prev.includes(year) ? prev : [...prev, year]))
  }

  return (
    <PageDocuments
      workdayDocuments={workdayDocuments}
      fetchDocumentsByYear={fetchDocumentsByYear}
      onGenerateDocument={() => {}}
    />
  )
}
