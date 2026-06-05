import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  CalendarIcon,
  ClockIcon,
  KeyRoundIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  RotateCcwIcon,
  ShieldAlertIcon,
  UserIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import type { UseFormReturn } from "react-hook-form"
import type z from "zod"
import type { editProfileFormSchema } from "@/shared/zod/edit-profile"
import type { editEmailFormSchema } from "@/shared/zod/edit-email"
import type { editPasswordFormSchema } from "@/shared/zod/edit-password"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { EditProfileDialog } from "@/shared/components/EditProfileDialog"
import { EditEmailDialog } from "@/shared/components/EditEmailDialog"
import { EditPasswordDialog } from "@/shared/components/EditPasswordDialog"
import { AccountStatusDialog } from "@/shared/components/AccountStatusDialog"
import type { GetMeResponse } from "@/shared/queries/driver/driver.types"

interface PagePersonalInformationProps {
  meData: GetMeResponse | null
  isLoadingMe: boolean
  isUpdatingMe: boolean
  isDeactivating: boolean
  isProfileDialogOpen: boolean
  isEmailDialogOpen: boolean
  isPasswordDialogOpen: boolean
  accountStatusDialog: "deactivate" | "restore" | null
  profileForm: UseFormReturn<z.infer<typeof editProfileFormSchema>>
  emailForm: UseFormReturn<z.infer<typeof editEmailFormSchema>>
  passwordForm: UseFormReturn<z.infer<typeof editPasswordFormSchema>>
  deactivationDays?: number
  onOpenProfileDialog: () => void
  onOpenEmailDialog: () => void
  onOpenPasswordDialog: () => void
  onProfileDialogOpenChange: (open: boolean) => void
  onEmailDialogOpenChange: (open: boolean) => void
  onPasswordDialogOpenChange: (open: boolean) => void
  onAccountStatusDialogChange: (mode: "deactivate" | "restore" | null) => void
  onProfileSubmit: (values: z.infer<typeof editProfileFormSchema>) => void
  onEmailSubmit: (values: z.infer<typeof editEmailFormSchema>) => void
  onPasswordSubmit: (values: z.infer<typeof editPasswordFormSchema>) => void
  onDeactivate: () => void
  onRestore: () => void
  onBack: () => void
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
        <Skeleton className="h-4 w-28" />
      ) : (
        <p className="text-sm font-medium">{value}</p>
      )}
    </div>
  )
}

function SectionHeader({
  title,
  editLabel,
  onEdit,
  disabled,
}: {
  title: string
  editLabel: string
  onEdit: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-muted-foreground font-mono text-sm uppercase">{title}</h2>
      <Button variant="outline" size="sm" onClick={onEdit} disabled={disabled}>
        <PencilIcon className="size-3.5" />
        {editLabel}
      </Button>
    </div>
  )
}

export default function PagePersonalInformation({
  meData,
  isLoadingMe,
  isUpdatingMe,
  isDeactivating,
  isProfileDialogOpen,
  isEmailDialogOpen,
  isPasswordDialogOpen,
  accountStatusDialog,
  profileForm,
  emailForm,
  passwordForm,
  deactivationDays,
  onOpenProfileDialog,
  onOpenEmailDialog,
  onOpenPasswordDialog,
  onProfileDialogOpenChange,
  onEmailDialogOpenChange,
  onPasswordDialogOpenChange,
  onAccountStatusDialogChange,
  onProfileSubmit,
  onEmailSubmit,
  onPasswordSubmit,
  onDeactivate,
  onRestore,
  onBack,
}: PagePersonalInformationProps) {
  const { t, i18n } = useTranslation()

  const notSet = <span className="text-muted-foreground font-normal">—</span>

  const genderLabel = meData?.gender ? t(`forms.registration.genders.${meData.gender}`) : notSet

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
        <h1 className="text-2xl font-semibold">
          {t("pages.account.personal-information.page-title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* Left column — Profile */}
        <div className="flex flex-col gap-1.5">
          <SectionHeader
            title={t("pages.account.personal-information.sections.profile.title")}
            editLabel={t("pages.account.personal-information.sections.profile.edit-button")}
            onEdit={onOpenProfileDialog}
            disabled={isLoadingMe || isUpdatingMe}
          />
          <div className="flex flex-col divide-y rounded-lg border">
            <InfoRow
              icon={UserIcon}
              label={t("forms.registration.firstname-label")}
              value={isLoadingMe ? undefined : (meData?.firstname ?? notSet)}
              isLoading={isLoadingMe}
            />
            <InfoRow
              icon={UserIcon}
              label={t("forms.registration.lastname-label")}
              value={isLoadingMe ? undefined : (meData?.lastname ?? notSet)}
              isLoading={isLoadingMe}
            />
            <InfoRow
              icon={UserIcon}
              label={t("forms.registration.gender-label")}
              value={isLoadingMe ? undefined : genderLabel}
              isLoading={isLoadingMe}
            />
            <InfoRow
              icon={PhoneIcon}
              label={t("forms.edit-personal-information.phone-number-label")}
              value={isLoadingMe ? undefined : (meData?.phone_number ?? notSet)}
              isLoading={isLoadingMe}
            />
          </div>
        </div>

        {/* Right column — Email, Password, Account info, Danger zone */}
        <div className="flex flex-col gap-6">
          {/* Email section */}
          <div className="flex flex-col gap-1.5">
            <SectionHeader
              title={t("pages.account.personal-information.sections.email.title")}
              editLabel={t("pages.account.personal-information.sections.email.edit-button")}
              onEdit={onOpenEmailDialog}
              disabled={isLoadingMe || isUpdatingMe}
            />
            <div className="flex flex-col divide-y rounded-lg border">
              <div className="flex items-center gap-3 px-4 py-3">
                <MailIcon className="text-muted-foreground size-4 shrink-0" />
                {isLoadingMe ? (
                  <Skeleton className="h-4 w-48" />
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <p className="truncate text-sm font-medium">{meData?.email ?? "—"}</p>
                    {meData?.verified_at && (
                      <BadgeCheckIcon className="text-primary size-4 shrink-0" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Password section */}
          <div className="flex flex-col gap-1.5">
            <SectionHeader
              title={t("pages.account.personal-information.sections.password.title")}
              editLabel={t("pages.account.personal-information.sections.password.edit-button")}
              onEdit={onOpenPasswordDialog}
              disabled={isUpdatingMe}
            />
            <div className="flex flex-col divide-y rounded-lg border">
              <InfoRow
                icon={KeyRoundIcon}
                label={t("pages.account.personal-information.sections.password.title")}
                value={t("pages.account.personal-information.sections.password.placeholder")}
              />
            </div>
          </div>

          {/* Account info section */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-muted-foreground font-mono text-sm uppercase">
              {t("pages.account.personal-information.sections.account-info.title")}
            </h2>
            <div className="flex flex-col divide-y rounded-lg border">
              <InfoRow
                icon={CalendarIcon}
                label={t("pages.account.personal-information.sections.account-info.member-since")}
                value={
                  meData?.created_at
                    ? new Date(meData.created_at).toLocaleDateString(i18n.language, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : notSet
                }
                isLoading={isLoadingMe}
              />
              <InfoRow
                icon={ClockIcon}
                label={t("pages.account.personal-information.sections.account-info.last-login")}
                value={
                  meData?.last_login_at
                    ? new Date(meData.last_login_at).toLocaleDateString(i18n.language, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : notSet
                }
                isLoading={isLoadingMe}
              />
              <InfoRow
                icon={BadgeCheckIcon}
                label={t("pages.account.personal-information.sections.account-info.verified")}
                value={
                  meData?.verified_at ? (
                    <span className="text-primary font-medium">
                      {t("pages.account.personal-information.sections.account-info.verified-yes")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-normal">
                      {t("pages.account.personal-information.sections.account-info.verified-no")}
                    </span>
                  )
                }
                isLoading={isLoadingMe}
              />
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-muted-foreground font-mono text-sm uppercase">
              {t("pages.account.personal-information.sections.danger-zone.title")}
            </h2>
            {isLoadingMe ? (
              <Skeleton className="h-[68px] w-full rounded-lg" />
            ) : meData?.deactivated_at ? (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 px-4 py-3 dark:border-amber-800/50">
                <div className="flex items-center gap-3">
                  <RotateCcwIcon className="size-4 shrink-0 text-amber-500" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">
                      {t(
                        "pages.account.personal-information.sections.danger-zone.deactivated-title"
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t(
                        "pages.account.personal-information.sections.danger-zone.deactivated-description",
                        {
                          date: new Date(
                            new Date(meData.deactivated_at).getTime() +
                              (deactivationDays ?? 0) * 86_400_000
                          ).toLocaleDateString(i18n.language, {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }),
                        }
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAccountStatusDialogChange("restore")}
                  disabled={isDeactivating}
                  className="shrink-0"
                >
                  {t("pages.account.personal-information.sections.danger-zone.restore-button")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 px-4 py-3 dark:border-red-900/50">
                <div className="flex items-center gap-3">
                  <ShieldAlertIcon className="size-4 shrink-0 text-red-500" />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">
                      {t(
                        "pages.account.personal-information.sections.danger-zone.deactivate-title"
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t(
                        "pages.account.personal-information.sections.danger-zone.deactivate-description",
                        { days: deactivationDays ?? "…" }
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAccountStatusDialogChange("deactivate")}
                  disabled={isLoadingMe || isDeactivating}
                  className="shrink-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20"
                >
                  {t("pages.account.personal-information.sections.danger-zone.deactivate-button")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileDialog
        isOpen={isProfileDialogOpen}
        form={profileForm}
        isLoading={isUpdatingMe}
        setIsOpen={onProfileDialogOpenChange}
        onSubmit={onProfileSubmit}
      />
      <EditEmailDialog
        isOpen={isEmailDialogOpen}
        form={emailForm}
        isLoading={isUpdatingMe}
        setIsOpen={onEmailDialogOpenChange}
        onSubmit={onEmailSubmit}
      />
      <EditPasswordDialog
        isOpen={isPasswordDialogOpen}
        form={passwordForm}
        isLoading={isUpdatingMe}
        setIsOpen={onPasswordDialogOpenChange}
        onSubmit={onPasswordSubmit}
      />
      {accountStatusDialog && (
        <AccountStatusDialog
          mode={accountStatusDialog}
          isOpen={true}
          setIsOpen={(open) => !open && onAccountStatusDialogChange(null)}
          isLoading={isDeactivating}
          deactivationDays={deactivationDays}
          onConfirm={accountStatusDialog === "deactivate" ? onDeactivate : onRestore}
        />
      )}
    </div>
  )
}
