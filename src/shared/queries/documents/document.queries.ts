import { useQuery } from "@tanstack/react-query"
import type { GetWorkdayDocumentsByYearRequest } from "./document.types"
import { getWorkdayDocuments, getWorkdayDocumentsByYear } from "./document.api"

export const workdayDocumentsKeys = {
  all: ["workday-documents"] as const,
  getWorkdayDocumentsByYear: (request: GetWorkdayDocumentsByYearRequest) =>
    [...workdayDocumentsKeys.all, `workday-documents-year-${request.year}`] as const,
}

export const useGetWorkdayDocuments = () =>
  useQuery({
    queryKey: workdayDocumentsKeys.all,
    queryFn: () => getWorkdayDocuments(),
  })

export const useGetWorkdayDocumentsByYear = (request: GetWorkdayDocumentsByYearRequest) =>
  useQuery({
    queryKey: workdayDocumentsKeys.getWorkdayDocumentsByYear(request),
    queryFn: () => getWorkdayDocumentsByYear(request),
  })

export const useGenerateWorkdayDocument = (month: number, year: number) =>
  useQuery({
    queryKey: [...workdayDocumentsKeys.all, `generate-workday-document-${year}-${month}`] as const,
    queryFn: () => getWorkdayDocumentsByYear({ year }),
  })
