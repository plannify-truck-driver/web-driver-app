import { useAuth } from "@/app/providers/AuthProvider"
import { useDocumentTitle } from "@/hooks/use-document-title"
import { useTranslation } from "react-i18next"
import PagePersonalInformation from "../ui/PagePersonalInformation"
import { useGetMe, useUpdateMeMutation } from "@/shared/queries/driver/driver.queries"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { editProfileFormSchema } from "@/shared/zod/edit-profile"
import { editEmailFormSchema } from "@/shared/zod/edit-email"
import { editPasswordFormSchema } from "@/shared/zod/edit-password"
import type z from "zod"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export default function PagePersonalInformationFeature() {
  const { login, refreshToken } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const { data: meData, isLoading: isLoadingMe } = useGetMe()
  const { mutateAsync: updateMe, isPending: isUpdatingMe } = useUpdateMeMutation()

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const profileForm = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: { firstname: "", lastname: "", gender: null, phone_number: null },
  })

  const emailForm = useForm<z.infer<typeof editEmailFormSchema>>({
    resolver: zodResolver(editEmailFormSchema),
    defaultValues: { email: "" },
  })

  const passwordForm = useForm<z.infer<typeof editPasswordFormSchema>>({
    resolver: zodResolver(editPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const { reset: resetProfile } = profileForm
  const { reset: resetEmail } = emailForm

  useEffect(() => {
    if (meData) {
      resetProfile({
        firstname: meData.firstname ?? "",
        lastname: meData.lastname ?? "",
        gender: meData.gender ?? null,
        phone_number: meData.phone_number ?? null,
      })
      resetEmail({ email: meData.email ?? "" })
    }
  }, [meData, resetProfile, resetEmail])

  function handleOpenProfileDialog() {
    if (meData) {
      profileForm.reset({
        firstname: meData.firstname ?? "",
        lastname: meData.lastname ?? "",
        gender: meData.gender ?? null,
        phone_number: meData.phone_number ?? null,
      })
    }
    setIsProfileDialogOpen(true)
  }

  function handleOpenEmailDialog() {
    if (meData) emailForm.reset({ email: meData.email ?? "" })
    setIsEmailDialogOpen(true)
  }

  function handleOpenPasswordDialog() {
    passwordForm.reset({ password: "", confirmPassword: "" })
    setIsPasswordDialogOpen(true)
  }

  async function handleProfileSubmit(values: z.infer<typeof editProfileFormSchema>) {
    if (!meData) return
    try {
      const response = await updateMe({
        firstname: values.firstname,
        lastname: values.lastname,
        gender: values.gender === "O" ? null : (values.gender ?? null),
        phone_number: values.phone_number ?? null,
        email: meData.email,
        language: i18n.language,
        password: null,
      })
      if (response?.access_token) login(response.access_token)
      else await refreshToken()
      setIsProfileDialogOpen(false)
      toast.success(t("pages.account.personal-information.toast.profile-update-success"))
    } catch {
      toast.error(t("pages.account.personal-information.toast.update-error"))
    }
  }

  async function handleEmailSubmit(values: z.infer<typeof editEmailFormSchema>) {
    if (!meData) return
    try {
      const response = await updateMe({
        email: values.email,
        firstname: meData.firstname,
        lastname: meData.lastname,
        gender: meData.gender,
        phone_number: meData.phone_number,
        language: i18n.language,
        password: null,
      })
      if (response?.access_token) login(response.access_token)
      else await refreshToken()
      setIsEmailDialogOpen(false)
      toast.success(t("pages.account.personal-information.toast.email-update-success"))
    } catch {
      toast.error(t("pages.account.personal-information.toast.update-error"))
    }
  }

  async function handlePasswordSubmit(values: z.infer<typeof editPasswordFormSchema>) {
    if (!meData) return
    try {
      const response = await updateMe({
        password: values.password,
        email: meData.email,
        firstname: meData.firstname,
        lastname: meData.lastname,
        gender: meData.gender,
        phone_number: meData.phone_number,
        language: i18n.language,
      })
      if (response?.access_token) login(response.access_token)
      else await refreshToken()
      setIsPasswordDialogOpen(false)
      passwordForm.reset({ password: "", confirmPassword: "" })
      toast.success(t("pages.account.personal-information.toast.password-update-success"))
    } catch {
      toast.error(t("pages.account.personal-information.toast.update-error"))
    }
  }

  useDocumentTitle(t("pages.account.personal-information.page-title"))

  return (
    <PagePersonalInformation
      meData={meData ?? null}
      isLoadingMe={isLoadingMe}
      isUpdatingMe={isUpdatingMe}
      isProfileDialogOpen={isProfileDialogOpen}
      isEmailDialogOpen={isEmailDialogOpen}
      isPasswordDialogOpen={isPasswordDialogOpen}
      profileForm={profileForm}
      emailForm={emailForm}
      passwordForm={passwordForm}
      onOpenProfileDialog={handleOpenProfileDialog}
      onOpenEmailDialog={handleOpenEmailDialog}
      onOpenPasswordDialog={handleOpenPasswordDialog}
      onProfileDialogOpenChange={setIsProfileDialogOpen}
      onEmailDialogOpenChange={setIsEmailDialogOpen}
      onPasswordDialogOpenChange={setIsPasswordDialogOpen}
      onProfileSubmit={handleProfileSubmit}
      onEmailSubmit={handleEmailSubmit}
      onPasswordSubmit={handlePasswordSubmit}
      onBack={() => navigate({ to: "/account" })}
    />
  )
}
