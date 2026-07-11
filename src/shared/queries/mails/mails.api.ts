import { api } from "@/shared/lib/api"
import type { Mail, MailPreference, MailsParams, MailsResponse, MailType } from "./mails.types"

export const getMails = ({ page = 1, limit = 10 }: MailsParams = {}): Promise<MailsResponse> => {
  return api.get("mails", { searchParams: { page, limit } }).json()
}

export const getMailById = (mailId: string): Promise<Mail> => {
  return api.get(`mails/${mailId}`).json()
}

export const getMailTypes = (): Promise<MailType[]> => api.get("mails/types").json()

export const getMailPreferences = (): Promise<MailPreference[]> =>
  api.get("mails/preferences").json()

export const updateMailPreference = (mailTypeId: number, isEnabled: boolean): Promise<void> =>
  api.put(`mails/preferences/${mailTypeId}`, { json: { is_enabled: isEnabled } }).json()

export const downloadMailAttachment = async (
  attachmentId: string,
  fallbackFileName: string
): Promise<void> => {
  const response = await api.get(`mails/attachments/${attachmentId}`)
  const blob = await response.blob()
  const disposition = response.headers.get("Content-Disposition") ?? ""
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match?.[1] ?? fallbackFileName

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
