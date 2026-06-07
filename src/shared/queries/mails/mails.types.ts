export interface MailAttachment {
  created_at: string
  file_name: string
  pk_driver_mail_attachment_id: string
}

export interface MailType {
  is_editable: boolean
  label: string
  pk_driver_mail_type_id: number
}

export type MailStatus = "PENDING" | "SUCCESS" | "FAILED"

export interface Mail {
  attachments: MailAttachment[]
  content: string | null
  created_at: string
  description: string
  email_used: string
  mail_type: MailType
  pk_driver_mail_id: string
  sent_at: string | null
  status: MailStatus
}

export interface MailsResponse {
  data: Mail[]
  page: number
  total: number
}

export interface MailsParams {
  page?: number
  limit?: number
}
