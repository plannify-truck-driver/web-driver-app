import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useDownloadMailAttachment, useGetMailById } from "@/shared/queries/mails/mails.queries"
import PageMailDetail from "../ui/PageMailDetail"
import { toast } from "sonner"
import { handleErrorResponse } from "@/shared/lib/error-response"

export default function PageMailDetailFeature() {
  const { t } = useTranslation()
  const { mailId } = useParams({ from: "/account/mails/$mailId" })
  const navigate = useNavigate()

  useDocumentTitle(t("pages.account.mail-detail.page-title"))

  const { data: mail, isLoading } = useGetMailById(mailId)
  const {
    mutate: downloadAttachment,
    isPending: isDownloading,
    variables: downloadingVariables,
  } = useDownloadMailAttachment()

  async function handleDownload(attachmentId: string, fileName: string) {
    downloadAttachment(
      { attachmentId, fileName },
      {
        onError: async (error) => {
          const apiError = await handleErrorResponse(error)
          if (apiError?.error_code === "MAIL_ATTACHMENT_NOT_FOUND") {
            toast.error(
              t("pages.account.mail-detail.sections.attachments.download-error-not-found")
            )
          } else {
            toast.error(t("pages.account.mail-detail.sections.attachments.download-error"))
          }
        },
      }
    )
  }

  return (
    <PageMailDetail
      mail={mail ?? null}
      isLoading={isLoading}
      isDownloading={isDownloading}
      downloadingAttachmentId={downloadingVariables?.attachmentId ?? null}
      onDownloadAttachment={handleDownload}
      onBack={() => navigate({ to: "/account/mails" })}
    />
  )
}
