import {
  ArrowLeftIcon,
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  PaperclipIcon,
  SendIcon,
  TagIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { Button } from "@/shared/components/ui/Button"
import type { Mail, MailStatus } from "@/shared/queries/mails/mails.types"
import { cn } from "@/lib/utils"

interface PageMailDetailProps {
  mail: Mail | null
  isLoading: boolean
  isDownloading: boolean
  downloadingAttachmentId: string | null
  onDownloadAttachment: (attachmentId: string, fileName: string) => void
  onBack: () => void
}

const STATUS_STYLES: Record<MailStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  FAILED: "bg-red-500/10 text-red-500 dark:text-red-400",
}

function StatusBadge({ status }: { status: MailStatus }) {
  const { t } = useTranslation()
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
      )}
    >
      {t(`pages.account.mails.status.${status}`)}
    </span>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  isLoading?: boolean
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="text-muted-foreground size-4 shrink-0" />
      <p className="text-muted-foreground min-w-0 flex-1 truncate text-sm">{label}</p>
      {isLoading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <div className="text-sm font-medium">{value}</div>
      )}
    </div>
  )
}

export default function PageMailDetail({
  mail,
  isLoading,
  isDownloading,
  downloadingAttachmentId,
  onDownloadAttachment,
  onBack,
}: PageMailDetailProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(i18n.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const mailTypeLabel = mail
    ? t(`pages.account.mails.types.${mail.mail_type.label}`, {
        defaultValue: mail.mail_type.label,
      })
    : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:bg-muted hover:text-primary cursor-pointer rounded-md p-1.5 transition-colors"
        >
          <ArrowLeftIcon className="size-5" />
          <span className="sr-only">{t("common.back")}</span>
        </button>
        <h1 className="text-2xl font-semibold">{t("pages.account.mail-detail.page-title")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left — Informations */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-muted-foreground font-mono text-sm uppercase">
            {t("pages.account.mail-detail.sections.info.title")}
          </h2>
          <div className="flex flex-col divide-y rounded-lg border">
            <InfoRow
              icon={TagIcon}
              label={t("pages.account.mails.table.type")}
              value={mailTypeLabel}
              isLoading={isLoading}
            />
            <InfoRow
              icon={MailIcon}
              label={t("pages.account.mails.table.email")}
              value={mail?.email_used}
              isLoading={isLoading}
            />
            <InfoRow
              icon={CalendarIcon}
              label={t("pages.account.mail-detail.sections.info.created-at")}
              value={mail?.created_at ? formatDate(mail.created_at) : null}
              isLoading={isLoading}
            />
            <InfoRow
              icon={SendIcon}
              label={t("pages.account.mail-detail.sections.info.sent-at")}
              value={
                mail ? (
                  mail.sent_at ? (
                    formatDate(mail.sent_at)
                  ) : (
                    <span className="text-muted-foreground font-normal">—</span>
                  )
                ) : null
              }
              isLoading={isLoading}
            />
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-muted-foreground size-4 shrink-0" />
              <p className="text-muted-foreground min-w-0 flex-1 truncate text-sm">
                {t("pages.account.mails.table.status")}
              </p>
              {isLoading ? (
                <Skeleton className="h-5 w-20 rounded-full" />
              ) : mail ? (
                <StatusBadge status={mail.status} />
              ) : null}
            </div>
          </div>
        </div>

        {/* Right — Description, Content, Attachments */}
        <div className="flex flex-col gap-6">
          {/* Description */}
          {(isLoading || mail?.description) && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-muted-foreground font-mono text-sm uppercase">
                {t("pages.account.mail-detail.sections.description.title")}
              </h2>
              <div className="rounded-lg border px-4 py-3">
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">{mail!.description}</p>
                    <p className="text-muted-foreground/60 text-xs italic">
                      {t("pages.account.mails.description-language-notice")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          {(isLoading || mail?.content) && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-muted-foreground font-mono text-sm uppercase">
                {t("pages.account.mail-detail.sections.content.title")}
              </h2>
              <div className="rounded-lg border px-4 py-3">
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{mail!.content}</p>
                )}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-muted-foreground font-mono text-sm uppercase">
              {t("pages.account.mail-detail.sections.attachments.title")}
            </h2>
            <div className="flex flex-col divide-y rounded-lg border">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-7 w-28 rounded-md" />
                  </div>
                ))
              ) : !mail || mail.attachments.length === 0 ? (
                <div className="flex items-center gap-2 px-4 py-3">
                  <FileTextIcon className="text-muted-foreground size-4" />
                  <p className="text-muted-foreground text-sm">
                    {t("pages.account.mail-detail.sections.attachments.empty")}
                  </p>
                </div>
              ) : (
                mail.attachments.map((attachment) => {
                  const isThisDownloading =
                    isDownloading &&
                    downloadingAttachmentId === attachment.pk_driver_mail_attachment_id
                  return (
                    <div
                      key={attachment.pk_driver_mail_attachment_id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <PaperclipIcon className="text-muted-foreground size-4 shrink-0" />
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        {attachment.file_name}
                      </p>
                      <p className="text-muted-foreground hidden text-xs sm:block">
                        {formatDate(attachment.created_at)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isThisDownloading}
                        disabled={isDownloading}
                        onClick={() =>
                          onDownloadAttachment(
                            attachment.pk_driver_mail_attachment_id,
                            attachment.file_name
                          )
                        }
                      >
                        <DownloadIcon className="size-3.5" />
                        {t("pages.account.mail-detail.sections.attachments.download")}
                      </Button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
