import { api } from "@/shared/lib/api"
import type {
  GenerateWorkdayDocumentRequest,
  GenerateWorkdayDocumentResponse,
  GetWorkdayDocumentsByYearRequest,
  GetWorkdayDocumentsByYearResponse,
} from "./document.types"

export const getWorkdayDocuments = (): Promise<number[]> => {
  return api.get("workdays/documents/year").json()
}

export const getWorkdayDocumentsByYear = (
  body: GetWorkdayDocumentsByYearRequest
): Promise<GetWorkdayDocumentsByYearResponse> => {
  return api.get(`workdays/documents/${body.year}`).json()
}

export const generateWorkdayDocument = async (
  params: GenerateWorkdayDocumentRequest
): Promise<GenerateWorkdayDocumentResponse> => {
  const response = await api.get(`workdays/documents/${params.year}/${params.month}`)
  const blob = await response.blob()
  const disposition = response.headers.get("Content-Disposition") ?? ""
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match?.[1] ?? `document-${params.year}-${params.month}.pdf`
  return { blob, filename }
}
