import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import type { Mail } from "../queries/mails/mails.types"
import { StatusBadge } from "./MailStatusBadge"
import type { TFunction } from "i18next"
import { PaperclipIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/Skeleton"

function mailTypeLabel(label: string, t: TFunction) {
  return t(`pages.account.mails.types.${label}`, { defaultValue: label })
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export interface MailCardProps {
  mail?: Mail
  isFirst: boolean
  isLast: boolean
}

export function MailCard({ mail, isFirst, isLast }: MailCardProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dateStr = mail?.sent_at ?? mail?.created_at

  return (
    <div
      className={cn(
        "bg-sidebar border-border flex w-full cursor-pointer flex-col gap-2 border-x border-t px-4 py-3",
        isFirst && "rounded-tl-lg rounded-tr-lg",
        isLast && "rounded-br-lg rounded-bl-lg border-b"
      )}
      onClick={() =>
        mail &&
        navigate({
          to: "/account/mails/$mailId",
          params: { mailId: mail.pk_driver_mail_id },
        })
      }
    >
      {mail && dateStr ? (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm leading-snug font-medium">
              {mailTypeLabel(mail.mail_type.label, t)}
            </p>
            <StatusBadge status={mail.status} />
          </div>
          {mail.description && (
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground line-clamp-2 text-sm">{mail.description}</p>
              <p className="text-muted-foreground/60 text-xs italic">
                {t("pages.account.mails.description-language-notice")}
              </p>
            </div>
          )}
          <div className="text-muted-foreground flex flex-row items-center justify-between gap-x-4 gap-y-1 text-xs">
            <span className="truncate">{mail.email_used}</span>
            <span>
              {mail.sent_at
                ? t("pages.account.mails.sent-at", { date: formatDate(dateStr, i18n.language) })
                : t("pages.account.mails.created-at", { date: formatDate(dateStr, i18n.language) })}
            </span>
          </div>
          {mail.attachments.length > 0 && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <PaperclipIcon className="size-3" />
              {t("pages.account.mails.attachments", { count: mail.attachments.length })}
            </span>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex flex-col gap-0.5">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex flex-row items-center justify-between gap-x-4 gap-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32" />
          </div>
        </>
      )}
    </div>
  )
}
