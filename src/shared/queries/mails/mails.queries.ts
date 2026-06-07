import { useMutation, useQuery } from "@tanstack/react-query"
import { downloadMailAttachment, getMailById, getMails } from "./mails.api"
import type { MailsParams } from "./mails.types"

export const mailsKeys = {
  all: ["mails"] as const,
  list: (params: MailsParams) => [...mailsKeys.all, params] as const,
  detail: (mailId: string) => [...mailsKeys.all, mailId] as const,
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

export const useDownloadMailAttachment = () =>
  useMutation({
    mutationFn: ({
      attachmentId,
      fileName,
    }: {
      attachmentId: string
      fileName: string
    }) => downloadMailAttachment(attachmentId, fileName),
  })
