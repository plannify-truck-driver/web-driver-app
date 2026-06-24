import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  downloadMailAttachment,
  getMailById,
  getMails,
  getMailPreferences,
  getMailTypes,
  updateMailPreference,
} from "./mails.api"
import type { MailsParams } from "./mails.types"

export const mailsKeys = {
  all: ["mails"] as const,
  list: (params: MailsParams) => [...mailsKeys.all, params] as const,
  detail: (mailId: string) => [...mailsKeys.all, mailId] as const,
  types: () => [...mailsKeys.all, "types"] as const,
  preferences: () => [...mailsKeys.all, "preferences"] as const,
}

export const useGetMails = (params: MailsParams = {}) =>
  useQuery({
    queryKey: mailsKeys.list(params),
    queryFn: () => getMails(params),
  })

export const useGetMailById = (mailId: string) =>
  useQuery({
    queryKey: mailsKeys.detail(mailId),
    queryFn: () => getMailById(mailId),
  })

export const useGetMailTypes = ({ enabled = true }: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: mailsKeys.types(),
    queryFn: getMailTypes,
    enabled,
  })

export const useGetMailPreferences = () =>
  useQuery({
    queryKey: mailsKeys.preferences(),
    queryFn: getMailPreferences,
  })

export const useUpdateMailPreference = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mailTypeId, isEnabled }: { mailTypeId: number; isEnabled: boolean }) =>
      updateMailPreference(mailTypeId, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailsKeys.preferences() })
    },
  })
}

export const useDownloadMailAttachment = () =>
  useMutation({
    mutationFn: ({ attachmentId, fileName }: { attachmentId: string; fileName: string }) =>
      downloadMailAttachment(attachmentId, fileName),
  })
