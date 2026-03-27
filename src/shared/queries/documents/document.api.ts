import { api } from "@/shared/lib/api"
import type {
  GenerateWorkdayDocumentRequest,
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

export const generateWorkdayDocument = (params: GenerateWorkdayDocumentRequest): Promise<Blob> => {
  return api.get(`workdays/documents/${params.year}/${params.month}`).blob()
}
